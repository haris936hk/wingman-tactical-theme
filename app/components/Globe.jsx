import {useEffect, useRef, useState} from 'react';
import {Color, Scene, Fog, PerspectiveCamera, Vector3} from 'three';
import ThreeGlobe from 'three-globe';
import {useThree, Canvas, extend} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';

extend({ThreeGlobe});

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

export function Globe({globeConfig, data}) {
  const [globeData, setGlobeData] = useState(null);
  const [countries, setCountries] = useState(null);

  const globeRef = useRef(null);

  // Load countries data from public folder (client-only, not bundled)
  useEffect(() => {
    fetch('/data/globe.json')
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => {
        console.error('Failed to load countries data:', error);
      });
  }, []);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: '#ffffff',
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: 'rgba(255,255,255,0.7)',
    globeColor: '#1d072e',
    emissive: '#000000',
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  useEffect(() => {
    if (globeRef.current) {
      _buildData();
      _buildMaterial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globeRef.current]);

  const _buildMaterial = () => {
    if (!globeRef.current) return;

    const globeMaterial = globeRef.current.globeMaterial();
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  };

  const _buildData = () => {
    const arcs = data;
    let points = [];
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      const rgb = hexToRgb(arc.color);
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    // remove duplicates for same lat and lng
    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ['lat', 'lng'].every(
            (k) => v2[k] === v[k]
          )
        ) === i
    );

    setGlobeData(filteredPoints);
  };

  useEffect(() => {
    if (globeRef.current && globeData && countries) {
      globeRef.current
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor(() => {
          return defaultProps.polygonColor;
        });
      startAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globeData, countries]);

  const startAnimation = () => {
    if (!globeRef.current || !globeData) return;

    globeRef.current
      .arcsData(data)
      .arcStartLat((d) => d.startLat * 1)
      .arcStartLng((d) => d.startLng * 1)
      .arcEndLat((d) => d.endLat * 1)
      .arcEndLng((d) => d.endLng * 1)
      .arcColor((e) => e.color)
      .arcAltitude((e) => {
        return e.arcAlt * 1;
      })
      .arcStroke(() => {
        return [0.32, 0.28, 0.3][Math.round(Math.random() * 2)];
      })
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((e) => e.order * 1)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    globeRef.current
      .pointsData(data)
      .pointColor((e) => e.color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor((e) => (t) => e.color(t))
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
      );
  };

  useEffect(() => {
    if (!globeRef.current || !globeData) return;

    // Get all unique orders from the data
    const orders = [...new Set(data.map((arc) => arc.order))].sort((a, b) => a - b);
    let orderIndex = 0;

    const updateRings = () => {
      if (!globeRef.current || !globeData) return;

      // Get current order to show rings for
      const currentOrder = orders[orderIndex];
      const ringsToShow = [];

      // Find all arcs with the current order
      data.forEach((arc) => {
        if (arc.order === currentOrder) {
          // Find the corresponding start and end points in globeData
          const startPoint = globeData.find(
            (p) => p.lat === arc.startLat && p.lng === arc.startLng
          );
          const endPoint = globeData.find(
            (p) => p.lat === arc.endLat && p.lng === arc.endLng
          );

          if (startPoint) ringsToShow.push(startPoint);
          if (endPoint) ringsToShow.push(endPoint);
        }
      });

      // Remove duplicate rings (same lat/lng)
      const uniqueRings = ringsToShow.filter(
        (ring, index, self) =>
          index === self.findIndex((r) => r.lat === ring.lat && r.lng === ring.lng)
      );

      globeRef.current.ringsData(uniqueRings);

      // Move to next order and loop back to start
      orderIndex = (orderIndex + 1) % orders.length;
    };

    // Initial update
    updateRings();

    // Update rings continuously
    const interval = setInterval(updateRings, defaultProps.arcTime);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globeRef.current, globeData]);

  return (
    <>
      <threeGlobe ref={globeRef} />
    </>
  );
}

export function WebGLRendererConfig() {
  const {gl, size} = useThree();

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      gl.setPixelRatio(window.devicePixelRatio);
    }
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0); // Transparent black background
  }, [gl, size]);

  return null;
}

export function World(props) {
  const {globeConfig} = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLRendererConfig />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        // eslint-disable-next-line react/no-unknown-property
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        // eslint-disable-next-line react/no-unknown-property
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        // eslint-disable-next-line react/no-unknown-property
        position={new Vector3(-200, 500, 200)}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.8}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
