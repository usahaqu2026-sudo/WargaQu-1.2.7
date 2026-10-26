import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Compass,
  MapPin,
  Navigation,
  ExternalLink,
  Store,
  Bike,
  Shield,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Filter,
  CheckCircle,
  Clock,
  Sparkles,
  Phone,
  AlertCircle,
  Info,
  DollarSign,
  ChevronRight,
  Radio,
  X,
  MessageSquare,
  Locate,
  LocateFixed,
  List,
  Map as MapIcon,
  RefreshCw,
  Navigation2,
  CheckCircle2,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { AreaPoint, TransportasiCourier, UserProfile } from '../../types';
import { AppQuStorageService } from '../../services/storageAppQu';

interface AreaQuViewProps {
  currentUser: UserProfile;
  areaPoints?: AreaPoint[];
  couriers?: TransportasiCourier[];
  onOpenUsaha?: () => void;
  onOpenChat?: (threadId?: string) => void;
  showNotification: (msg: string) => void;
  // External filter and modal props from AppQuHeader
  selectedRadiusMeters?: number;
  onSelectRadius?: (radius: number) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  isRentalModalOpen?: boolean;
  onCloseRentalModal?: () => void;
  isNeutralityModalOpen?: boolean;
  onCloseNeutralityModal?: () => void;
  activeSubTab?: string;
  onSelectSubTab?: (tab: string) => void;
  theme?: 'light' | 'dark';
}

// Haversine Distance Formula in Meters
function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// OpenStreetMap Reference Coordinates: https://www.openstreetmap.org/#map=19/-6.467323/106.777665
const OSM_BASE_COORDS = { lat: -6.467323, lng: 106.777665, zoom: 19 };

export const AreaQuView: React.FC<AreaQuViewProps> = ({
  currentUser,
  areaPoints: initialAreaPoints,
  couriers: initialCouriers,
  onOpenUsaha,
  onOpenChat,
  showNotification,
  selectedRadiusMeters: propRadiusMeters,
  onSelectRadius,
  selectedCategory: propCategory,
  onSelectCategory,
  isRentalModalOpen: propRentalModalOpen,
  onCloseRentalModal,
  isNeutralityModalOpen: propNeutralityModalOpen,
  onCloseNeutralityModal,
  activeSubTab,
  onSelectSubTab,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  // Radius & Category state (use prop if provided, else fallback to local)
  const [localRadiusMeters, setLocalRadiusMeters] = useState<number>(3000);
  const [localCategory, setLocalCategory] = useState<string>('all');
  const [localRentalModalOpen, setLocalRentalModalOpen] = useState(false);
  const [localNeutralityModalOpen, setLocalNeutralityModalOpen] = useState(false);

  const selectedRadiusMeters = propRadiusMeters ?? localRadiusMeters;
  const selectedCategory = propCategory ?? localCategory;
  const isRentalModalOpen = propRentalModalOpen ?? localRentalModalOpen;
  const isNeutralityModalOpen = propNeutralityModalOpen ?? localNeutralityModalOpen;

  const handleCloseRental = () => {
    if (onCloseRentalModal) onCloseRentalModal();
    setLocalRentalModalOpen(false);
  };

  const handleCloseNeutrality = () => {
    if (onCloseNeutralityModal) onCloseNeutralityModal();
    setLocalNeutralityModalOpen(false);
  };

  // View Mode: Interactive Map vs Card List
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  useEffect(() => {
    if (activeSubTab === 'map') {
      setViewMode('map');
    } else if (activeSubTab === 'list') {
      setViewMode('list');
    }
  }, [activeSubTab]);

  // Tile layer style: 'standard' (OSM standard) | 'voyager' (CartoDB OSM Voyager)
  const [tileLayerStyle, setTileLayerStyle] = useState<'standard' | 'voyager'>('standard');

  // Current zoom state for UI badge
  const [currentZoom, setCurrentZoom] = useState<number>(OSM_BASE_COORDS.zoom);

  // REAL GPS ENGINE & USER GEOLOCATION
  const [userGps, setUserGps] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
    heading?: number | null;
  } | null>(null);

  const [gpsStatus, setGpsStatus] = useState<
    'detecting' | 'locked' | 'denied' | 'unavailable' | 'idle'
  >('detecting');

  const [gpsErrorMsg, setGpsErrorMsg] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Active Map Center Mode: 'osm_base' | 'gps'
  const [activeCenterMode, setActiveCenterMode] = useState<'osm_base' | 'gps'>('osm_base');

  // Request / Trigger Live GPS
  const requestGpsLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatus('unavailable');
      setGpsErrorMsg('GPS tidak didukung oleh browser/perangkat ini.');
      return;
    }

    setIsLocating(true);
    setGpsStatus('detecting');
    setGpsErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy, heading } = pos.coords;
        const newCoords = {
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy || 10),
          heading,
        };
        setUserGps(newCoords);
        setGpsStatus('locked');
        setIsLocating(false);
        showNotification(
          `🛰️ GPS Terdeteksi: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (±${Math.round(accuracy)}m)`
        );
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation initial error:', err);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsStatus('denied');
          setGpsErrorMsg('Izin akses lokasi ditolak oleh pengguna/perangkat.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsStatus('unavailable');
          setGpsErrorMsg('Sinyal GPS belum ditemukan. Pastikan GPS HP aktif.');
        } else if (err.code === err.TIMEOUT) {
          setGpsStatus('unavailable');
          setGpsErrorMsg('Pencarian GPS timeout. Menggunakan mode peta default.');
        } else {
          setGpsStatus('unavailable');
          setGpsErrorMsg('Gagal mendapatkan titik GPS.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [showNotification]);

  // Run GPS auto-detection on mount + background watchPosition
  useEffect(() => {
    requestGpsLocation();

    let watchId: number | null = null;
    if (typeof window !== 'undefined' && navigator.geolocation) {
      try {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude, accuracy, heading } = pos.coords;
            setUserGps({
              lat: latitude,
              lng: longitude,
              accuracy: Math.round(accuracy || 10),
              heading,
            });
            setGpsStatus('locked');
            setGpsErrorMsg(null);
          },
          (err) => {
            console.warn('Geolocation watch background warning:', err);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 5000,
          }
        );
      } catch (e) {
        console.warn('watchPosition failed:', e);
      }
    }

    return () => {
      if (watchId !== null && typeof window !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [requestGpsLocation]);

  // Points & Couriers State
  const [points, setPoints] = useState<AreaPoint[]>(() =>
    initialAreaPoints && initialAreaPoints.length > 0
      ? initialAreaPoints
      : AppQuStorageService.getAreaPoints()
  );

  const [couriers, setCouriers] = useState<TransportasiCourier[]>(() =>
    initialCouriers && initialCouriers.length > 0
      ? initialCouriers
      : AppQuStorageService.getCouriers()
  );

  // Selected Point / Courier for details drawer
  const [selectedPoint, setSelectedPoint] = useState<AreaPoint | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<TransportasiCourier | null>(null);

  // Courier Heartbeat Ticker
  const [heartbeatCounter, setHeartbeatCounter] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeartbeatCounter((prev) => {
        if (prev <= 1) {
          // Heartbeat tick: slightly move active couriers
          setCouriers((currentCouriers) =>
            currentCouriers.map((c) => {
              if (c.status === 'mengantar') {
                const deltaLat = (Math.random() - 0.5) * 0.00015;
                const deltaLng = (Math.random() - 0.5) * 0.00015;
                return {
                  ...c,
                  lat: c.lat + deltaLat,
                  lng: c.lng + deltaLng,
                  lastHeartbeatSeconds: 1,
                  batteryPercent: Math.max(10, c.batteryPercent - 0.05),
                };
              }
              return { ...c, lastHeartbeatSeconds: 1 };
            })
          );
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter Points according to radius and category
  const filteredPoints = useMemo(() => {
    const originLat = userGps ? userGps.lat : OSM_BASE_COORDS.lat;
    const originLng = userGps ? userGps.lng : OSM_BASE_COORDS.lng;

    return points
      .map((p) => {
        const dist = calculateDistanceMeters(originLat, originLng, p.lat, p.lng);
        return { ...p, distanceMeters: dist };
      })
      .filter((p) => {
        const matchesRadius = p.distanceMeters <= selectedRadiusMeters;
        if (!matchesRadius) return false;
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'lapak')
          return (
            p.category === 'kuliner' ||
            p.category === 'sembako' ||
            p.category === 'jasa' ||
            p.category === 'bengkel' ||
            p.category === 'klinik'
          );
        if (selectedCategory === 'titik_netral') return p.isPoliticalOrNeutralOnly;
        return p.category === selectedCategory;
      });
  }, [points, userGps, selectedRadiusMeters, selectedCategory]);

  // ====================================================
  // LEAFLET MAP REFS & INSTANCE
  // ====================================================
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const geofenceLayerRef = useRef<L.Polygon | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (viewMode !== 'map') return;

    if (!mapInstanceRef.current) {
      // Create Map centered at Bojongsari/Curug OpenStreetMap base: -6.467323, 106.777665, zoom 19
      const map = L.map(mapContainerRef.current, {
        center: [OSM_BASE_COORDS.lat, OSM_BASE_COORDS.lng],
        zoom: OSM_BASE_COORDS.zoom,
        maxZoom: 20,
        minZoom: 12,
        zoomControl: false,
        attributionControl: true,
      });

      // Standard OpenStreetMap Tile Layer
      const tileUrl =
        tileLayerStyle === 'standard'
          ? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const attribution =
        tileLayerStyle === 'standard'
          ? '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 20,
        attribution,
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Group for all custom markers (POIs, couriers, GPS dot)
      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      // Geofence Polygon for Community Boundary
      const geofenceCoords: [number, number][] = [
        [-6.4668, 106.7770],
        [-6.4668, 106.7783],
        [-6.4679, 106.7784],
        [-6.4679, 106.7770],
      ];
      const geofence = L.polygon(geofenceCoords, {
        color: '#059669',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#10b981',
        fillOpacity: 0.08,
      }).addTo(map);
      geofenceLayerRef.current = geofence;

      // Radius Circle Filter
      const radiusCircle = L.circle([OSM_BASE_COORDS.lat, OSM_BASE_COORDS.lng], {
        radius: Math.min(selectedRadiusMeters, 5000),
        color: '#0284c7',
        weight: 1.5,
        dashArray: '5, 5',
        fillColor: '#38bdf8',
        fillOpacity: 0.05,
      }).addTo(map);
      radiusCircleRef.current = radiusCircle;

      // Track zoom level changes
      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      mapInstanceRef.current = map;
    }

    // Invalidate map size on layout / container resize
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [viewMode]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer if user switches style (OSM vs Voyager)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const tileUrl =
      tileLayerStyle === 'standard'
        ? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    tileLayerRef.current.setUrl(tileUrl);
  }, [tileLayerStyle]);

  // Update Radius Circle radius & position
  useEffect(() => {
    if (!radiusCircleRef.current) return;
    const centerLat = activeCenterMode === 'gps' && userGps ? userGps.lat : OSM_BASE_COORDS.lat;
    const centerLng = activeCenterMode === 'gps' && userGps ? userGps.lng : OSM_BASE_COORDS.lng;

    radiusCircleRef.current.setLatLng([centerLat, centerLng]);
    radiusCircleRef.current.setRadius(Math.min(selectedRadiusMeters, 5000));
  }, [selectedRadiusMeters, activeCenterMode, userGps]);

  // Update Markers on Leaflet Map
  useEffect(() => {
    const markersGroup = markersLayerRef.current;
    if (!markersGroup || !mapInstanceRef.current) return;

    markersGroup.clearLayers();

    // 1. User GPS Marker (Blue beacon with radar pulse)
    if (userGps) {
      const userGpsIcon = L.divIcon({
        className: 'user-gps-marker',
        html: `
          <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; inset: 0px; border-radius: 9999px; background-color: rgba(14, 165, 233, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 16px; height: 16px; border-radius: 9999px; background-color: #0284c7; border: 2.5px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);"></div>
            <div style="position: absolute; top: 32px; left: 50%; transform: translateX(-50%); white-space: nowrap; background: rgba(15, 23, 42, 0.9); color: #38bdf8; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.4); box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              Posisi GPS Saya
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const userMarker = L.marker([userGps.lat, userGps.lng], { icon: userGpsIcon });
      userMarker.on('click', () => {
        showNotification(
          `Posisi Anda: ${userGps.lat.toFixed(5)}, ${userGps.lng.toFixed(5)} (Akurasi ±${userGps.accuracy}m)`
        );
      });
      markersGroup.addLayer(userMarker);
    }

    // 2. Area Points (POIs / Lapak / Fasum)
    filteredPoints.forEach((pt) => {
      const isSelected = selectedPoint?.id === pt.id;
      const emoji =
        pt.category === 'kuliner'
          ? '🍲'
          : pt.category === 'sembako'
          ? '🛒'
          : pt.category === 'bengkel'
          ? '🔧'
          : pt.category === 'klinik'
          ? '💊'
          : pt.category === 'fasum'
          ? '🏛️'
          : pt.isPoliticalOrNeutralOnly
          ? '⚖️'
          : '📍';

      const bgColor = pt.isPoliticalOrNeutralOnly
        ? '#64748b'
        : pt.category === 'fasum'
        ? '#0284c7'
        : pt.isDigitalStallRented
        ? '#f59e0b'
        : pt.businessMode === 'mode_a_pos'
        ? '#059669'
        : '#7c3aed';

      const truncatedName = pt.name.length > 15 ? `${pt.name.slice(0, 13)}...` : pt.name;

      const pointIcon = L.divIcon({
        className: 'appqu-poi-marker',
        html: `
          <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;" onmouseenter="this.style.transform='scale(1.15)'" onmouseleave="this.style.transform='scale(1)'">
            ${
              pt.isDigitalStallRented
                ? '<div style="position: absolute; inset: -4px; border-radius: 9999px; background-color: rgba(245, 158, 11, 0.45); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>'
                : ''
            }
            <div style="width: 32px; height: 32px; border-radius: 12px; background-color: ${bgColor}; border: 2.5px solid #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25); display: flex; align-items: center; justify-content: center; font-size: 14px;">
              ${emoji}
            </div>
            <div style="position: absolute; top: 32px; left: 50%; transform: translateX(-50%); white-space: nowrap; background: #ffffff; color: #1e293b; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 6px; border: 1px solid #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">
              ${truncatedName}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: pointIcon });
      marker.on('click', () => {
        setSelectedPoint(pt);
        setSelectedCourier(null);
      });
      markersGroup.addLayer(marker);
    });

    // 3. TransportasiQu Couriers (🛵 moving markers)
    couriers.forEach((courier) => {
      const isSelected = selectedCourier?.id === courier.id;
      const courierIcon = L.divIcon({
        className: 'appqu-courier-marker',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; inset: -2px; border-radius: 9999px; background-color: rgba(14, 165, 233, 0.35); animation: ping 2s infinite;"></div>
            <div style="width: 28px; height: 28px; border-radius: 9999px; background-color: #0284c7; border: 2px solid #ffffff; box-shadow: 0 3px 6px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; font-size: 14px;">
              🛵
            </div>
            <div style="position: absolute; top: 28px; left: 50%; transform: translateX(-50%); white-space: nowrap; background: #0f172a; color: #7dd3fc; font-size: 8px; font-weight: 800; padding: 1.5px 5px; border-radius: 5px; border: 1px solid #0284c7;">
              ${courier.driverName}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const courierMarker = L.marker([courier.lat, courier.lng], { icon: courierIcon });
      courierMarker.on('click', () => {
        setSelectedCourier(courier);
        setSelectedPoint(null);
      });
      markersGroup.addLayer(courierMarker);
    });
  }, [filteredPoints, couriers, userGps, selectedPoint, selectedCourier, showNotification]);

  // Launch Silent Navigation to external Google Maps / Waze
  const handleLaunchGoogleMaps = (lat: number, lng: number, name: string) => {
    const originParam = userGps ? `&origin=${userGps.lat},${userGps.lng}` : '';
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${originParam}&destination_place_id=${encodeURIComponent(
      name
    )}`;
    window.open(url, '_blank');
    showNotification(`Membuka rute ke ${name} di Google Maps`);
  };

  const handleLaunchWaze = (lat: number, lng: number, name: string) => {
    const url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    window.open(url, '_blank');
    showNotification(`Membuka rute ke ${name} di Waze`);
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  // Fly to exact OpenStreetMap base
  const handleFlyToOsmBase = () => {
    setActiveCenterMode('osm_base');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([OSM_BASE_COORDS.lat, OSM_BASE_COORDS.lng], OSM_BASE_COORDS.zoom, {
        duration: 1.2,
      });
      showNotification('Peta dipusatkan ke Titik Base OpenStreetMap (-6.467323, 106.777665).');
    }
  };

  // Fly to User GPS
  const handleFlyToGps = () => {
    if (userGps) {
      setActiveCenterMode('gps');
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([userGps.lat, userGps.lng], 19, {
          duration: 1.2,
        });
        showNotification('Peta dipusatkan ke koordinat GPS Anda.');
      }
    } else {
      requestGpsLocation();
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col overflow-hidden relative h-full transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* ========================================================= */}
      {/* TOP LIVE STATUS & BASE OSM INFORMATION BAR                */}
      {/* ========================================================= */}
      <div
        className={`border-b px-3 py-2 flex items-center justify-between text-xs shrink-0 select-none shadow-xs z-20 transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Left: OpenStreetMap Base info & GPS Status */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0 ring-2 ring-emerald-500/30"></span>
            <div className="truncate">
              <p className={`font-bold text-[11px] flex items-center gap-1 leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className="text-emerald-500 font-extrabold">OpenStreetMap 100% Gratis</span>
                <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  (Zoom {currentZoom})
                </span>
              </p>
              <p className={`text-[10px] font-mono truncate mt-0.5 ${isDark ? 'text-emerald-300/80' : 'text-emerald-700/80'}`}>
                Base: {OSM_BASE_COORDS.lat.toFixed(6)}, {OSM_BASE_COORDS.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Cek GPS HP button */}
          <button
            type="button"
            onClick={requestGpsLocation}
            disabled={isLocating}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors active:scale-95 disabled:opacity-50 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
            title="Deteksi Ulang GPS HP"
          >
            <Locate className={`w-3 h-3 text-sky-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Cari...' : userGps ? 'GPS Aktif' : 'Cek GPS'}</span>
          </button>

          {/* Toggle View Mode: Peta OSM vs Daftar */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors active:scale-95 ${
              viewMode === 'list'
                ? 'bg-emerald-600 text-white'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            {viewMode === 'map' ? (
              <>
                <List className="w-3 h-3" />
                <span>Daftar</span>
              </>
            ) : (
              <>
                <MapIcon className="w-3 h-3" />
                <span>Peta OSM</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW MODE 1: INTERACTIVE OPENSTREETMAP (LEAFLET ENGINE)   */}
      {/* ========================================================= */}
      {viewMode === 'map' && (
        <div className="flex-1 relative overflow-hidden bg-stone-200 w-full min-h-[420px] h-full">
          {/* Map Container for Leaflet */}
          <div
            ref={mapContainerRef}
            className="w-full h-full relative z-0 cursor-grab active:cursor-grabbing"
            style={{ minHeight: '400px' }}
          />

          {/* Floating Top-Left: TransportasiQu Heartbeat & Tile Info */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            <div className="bg-stone-900/90 text-stone-100 backdrop-blur-xs px-2.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-2 border border-stone-700 shadow-md pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
              <span>TransportasiQu ({heartbeatCounter}s)</span>
              <span className="text-sky-300 font-mono font-normal">
                {couriers.length} Kurir
              </span>
            </div>

            <div className="bg-emerald-950/85 text-emerald-200 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[9px] font-mono border border-emerald-700/50 shadow pointer-events-auto flex items-center gap-1.5">
              <span>📍 -6.467323, 106.777665</span>
              <span className="text-emerald-400 font-bold">• Ringan & Mudah Digeser</span>
            </div>
          </div>

          {/* Floating Top-Right Controls: Zoom, Fly Base, Fly GPS, Layer Switcher */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            {/* Ke Titik Acuan OpenStreetMap (User Link: https://www.openstreetmap.org/#map=19/-6.467323/106.777665) */}
            <button
              type="button"
              onClick={handleFlyToOsmBase}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1.5 text-[10px] font-extrabold cursor-pointer transition-all active:scale-95 border border-emerald-400"
              title="Pusatkan ke Titik Acuan OpenStreetMap (-6.467323, 106.777665)"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Titik OSM</span>
            </button>

            {/* Ke GPS Pengguna */}
            <button
              type="button"
              onClick={handleFlyToGps}
              className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center font-bold cursor-pointer transition-all active:scale-95 self-end ${
                activeCenterMode === 'gps' && userGps
                  ? 'bg-sky-600 text-white ring-2 ring-sky-300'
                  : 'bg-white text-sky-700 hover:bg-stone-50 border border-stone-200'
              }`}
              title="Pusatkan ke Posisi GPS Saya"
            >
              <LocateFixed className="w-4 h-4" />
            </button>

            {/* Ganti Gaya Peta (OSM Standard vs CartoDB Voyager) */}
            <button
              type="button"
              onClick={() => {
                const nextStyle = tileLayerStyle === 'standard' ? 'voyager' : 'standard';
                setTileLayerStyle(nextStyle);
                showNotification(
                  nextStyle === 'voyager'
                    ? 'Beralih ke Tile OSM Voyager (Tampilan Kontras Bersih)'
                    : 'Beralih ke Tile OpenStreetMap Standar Resmi'
                );
              }}
              className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center font-bold cursor-pointer transition-all active:scale-95 self-end ${
                tileLayerStyle === 'voyager'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                  : 'bg-white text-stone-800 hover:bg-stone-50 border border-stone-200'
              }`}
              title="Ganti Lapisan Tile Peta (OSM Standar vs Voyager)"
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Zoom In */}
            <button
              type="button"
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.zoomIn();
                }
              }}
              className="w-9 h-9 rounded-xl bg-white hover:bg-stone-50 text-stone-800 shadow-md flex items-center justify-center border border-stone-200 font-bold cursor-pointer transition-all active:scale-95 self-end"
              title="Perbesar Peta (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Zoom Out */}
            <button
              type="button"
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.zoomOut();
                }
              }}
              className="w-9 h-9 rounded-xl bg-white hover:bg-stone-50 text-stone-800 shadow-md flex items-center justify-center border border-stone-200 font-bold cursor-pointer transition-all active:scale-95 self-end"
              title="Perkecil Peta (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Floating Bottom-Left: Map Legend */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-2xl border border-stone-200 shadow-lg text-[10px] space-y-1 z-10 max-w-[210px]">
            <div className="text-[11px] font-black text-stone-900 border-b border-stone-100 pb-1 flex items-center justify-between">
              <span>Legenda AreaQu</span>
              <span className="text-[9px] text-emerald-700 font-bold">OSM Live</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200"></span>
              <span>Lapak Prioritas (Sewa)</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Mode A: POS Kasir Langsung</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <span>Mode B: Katalog Digital</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              <span>🛵 Kurir TransportasiQu</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW MODE 2: CARD LIST OF NEARBY PLACES BY REAL DISTANCE  */}
      {/* ========================================================= */}
      {viewMode === 'list' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-stone-100">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-stone-800">
              {filteredPoints.length} Titik UMKM & Fasilitas (Urut Terdekat)
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">
              Filter Radius:{' '}
              {selectedRadiusMeters >= 1000
                ? `${selectedRadiusMeters / 1000} km`
                : `${selectedRadiusMeters} m`}
            </span>
          </div>

          {filteredPoints.map((pt) => {
            const isSelected = selectedPoint?.id === pt.id;
            return (
              <div
                key={pt.id}
                onClick={() => {
                  setSelectedPoint(pt);
                  setViewMode('map');
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([pt.lat, pt.lng], 19, { duration: 1 });
                  }
                }}
                className={`p-3.5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                    : 'border-stone-200/90 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base text-white shrink-0 ${
                        pt.isDigitalStallRented
                          ? 'bg-amber-500'
                          : pt.category === 'fasum'
                          ? 'bg-blue-600'
                          : pt.category === 'bengkel'
                          ? 'bg-indigo-600'
                          : pt.category === 'klinik'
                          ? 'bg-rose-600'
                          : 'bg-emerald-700'
                      }`}
                    >
                      {pt.category === 'kuliner'
                        ? '🍲'
                        : pt.category === 'sembako'
                        ? '🛒'
                        : pt.category === 'bengkel'
                        ? '🔧'
                        : pt.category === 'klinik'
                        ? '💊'
                        : pt.category === 'fasum'
                        ? '🏛️'
                        : '📍'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-extrabold text-xs text-stone-900 truncate">
                          {pt.name}
                        </h4>
                        {pt.isDigitalStallRented && (
                          <span className="text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded-full">
                            Prioritas Sewa
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {pt.blockNumber} • {pt.ownerName || 'Komunitas Warga'}
                      </p>
                    </div>
                  </div>

                  {/* Real Distance Badge */}
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono font-bold text-xs border border-emerald-300">
                      {formatDistance(pt.distanceMeters)}
                    </span>
                    <span className="block text-[10px] text-stone-400 mt-0.5">dari Base</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                  {pt.description}
                </p>

                {/* Quick Action Navigation Buttons */}
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchGoogleMaps(pt.lat, pt.lng, pt.name);
                    }}
                    className="flex-1 py-1.5 px-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <Navigation2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Google Maps</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchWaze(pt.lat, pt.lng, pt.name);
                    }}
                    className="flex-1 py-1.5 px-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Waze</span>
                  </button>
                  {pt.phone && (
                    <a
                      href={`https://wa.me/${pt.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold flex items-center justify-center cursor-pointer transition-all"
                      title="Hubungi WhatsApp"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. POINT DETAIL DRAWER (BOTTOM CARD IF POI IS SELECTED)   */}
      {/* ========================================================= */}
      {selectedPoint && (
        <div className="bg-white border-t border-stone-200 p-3.5 shadow-2xl animate-in slide-in-from-bottom duration-200 shrink-0 z-20 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-2xs ${
                  selectedPoint.isDigitalStallRented
                    ? 'bg-amber-500'
                    : selectedPoint.category === 'fasum'
                    ? 'bg-blue-600'
                    : selectedPoint.isPoliticalOrNeutralOnly
                    ? 'bg-stone-500'
                    : 'bg-emerald-700'
                }`}
              >
                {selectedPoint.category === 'kuliner'
                  ? '🍲'
                  : selectedPoint.category === 'sembako'
                  ? '🛒'
                  : selectedPoint.category === 'bengkel'
                  ? '🔧'
                  : selectedPoint.category === 'klinik'
                  ? '💊'
                  : selectedPoint.category === 'fasum'
                  ? '🏛️'
                  : '📍'}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-extrabold text-base text-stone-900 leading-tight">
                    {selectedPoint.name}
                  </h3>
                  {selectedPoint.isDigitalStallRented && (
                    <span className="text-[10px] bg-amber-500 text-stone-950 font-black px-2 py-0.5 rounded-full">
                      Prioritas Sewa
                    </span>
                  )}
                  {selectedPoint.businessMode && (
                    <span className="text-[10px] bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded">
                      {selectedPoint.businessMode === 'mode_a_pos' ? 'Mode A: POS' : 'Mode B: Katalog'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  {selectedPoint.blockNumber} • Owner: {selectedPoint.ownerName || 'Komunitas Warga'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPoint(null)}
              className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {selectedPoint.description}
          </p>

          {/* Distance & Coordinate Stats */}
          <div className="flex items-center justify-between text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200">
            <div className="flex items-center gap-1 font-bold text-stone-800">
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Jarak Terhitung: {formatDistance(selectedPoint.distanceMeters)}</span>
            </div>
            <div className="text-[11px] font-mono text-stone-500">
              {selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() =>
                handleLaunchGoogleMaps(selectedPoint.lat, selectedPoint.lng, selectedPoint.name)
              }
              className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <Navigation2 className="w-4 h-4 text-emerald-400" />
              <span>Google Maps</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleLaunchWaze(selectedPoint.lat, selectedPoint.lng, selectedPoint.name)
              }
              className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Waze</span>
            </button>

            {onOpenUsaha && !selectedPoint.isPoliticalOrNeutralOnly && (
              <button
                type="button"
                onClick={() => {
                  setSelectedPoint(null);
                  onOpenUsaha();
                }}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <Store className="w-4 h-4" />
                <span>Buka Lapak</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. COURIER DETAIL DRAWER (🛵 SELEKSI KURIR)               */}
      {/* ========================================================= */}
      {selectedCourier && (
        <div className="bg-white border-t border-stone-200 p-3.5 shadow-2xl animate-in slide-in-from-bottom duration-200 shrink-0 z-20 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-sky-600 flex items-center justify-center font-black text-xl text-white shadow-2xs">
                🛵
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-base text-stone-900 leading-tight">
                    {selectedCourier.driverName}
                  </h3>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full border border-sky-300">
                    {selectedCourier.vehiclePlate}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  {selectedCourier.vehicleType} • Baterai HP: {Math.round(selectedCourier.batteryPercent)}%
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCourier(null)}
              className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs bg-sky-50 p-2.5 rounded-xl border border-sky-100 text-sky-950 font-medium">
            <span>Status: {selectedCourier.status.toUpperCase()}</span>
            <span className="font-mono text-sky-700">
              Heartbeat: {selectedCourier.lastHeartbeatSeconds}s lalu
            </span>
          </div>

          {/* 1-Click AppQu Local Chat & WhatsApp Chat/Call to Driver */}
          <div className="flex items-center gap-2 pt-1">
            {onOpenChat && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCourier(null);
                  onOpenChat('thread_transport_slamet');
                }}
                className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-emerald-400 border border-emerald-600/40 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Chat Driver</span>
              </button>
            )}
            <a
              href={`https://wa.me/${selectedCourier.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MODAL: SEWA LAPAK DIGITAL (RP 30.000 / TRIAL 10 HARI)  */}
      {/* ========================================================= */}
      {isRentalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base text-stone-900 leading-tight">
                    Sewa Lapak Digital AreaQu
                  </h3>
                  <p className="text-xs text-stone-500">Monetisasi Mandiri & Prioritas Peta</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseRental}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center cursor-pointer hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Paket Langganan Warga
                </span>
                <span className="text-xs bg-amber-600 text-white font-black px-2 py-0.5 rounded-full">
                  Trial 10 Hari Gratis
                </span>
              </div>
              <div className="text-2xl font-black text-amber-950">
                Rp 30.000 <span className="text-xs font-normal text-amber-800">/ bulan</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Tampilkan usaha Anda dengan pin prioritas bercahaya di peta radius
                AreaQu OpenStreetMap, serta etalase katalog paling atas untuk seluruh warga lingkungan.
              </p>
            </div>

            <div className="space-y-2 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pin Peta Emas Berkedip dengan Radius Filter hingga 100km</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Terhubung Langsung dengan POS Kasir (KulinerQu, RitelQu, BengkelQu)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pencarian Otomatis Berdasarkan Jarak GPS Terdekat</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleCloseRental();
                showNotification('Pengajuan Sewa Lapak Digital berhasil dikirim ke pengurus RT!');
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-2xl font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Mulai Trial 10 Hari Gratis
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL: KEBIJAKAN NETRALITAS PARTAI & ORMAS              */}
      {/* ========================================================= */}
      {isNeutralityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-stone-700 text-white flex items-center justify-center font-black">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base text-stone-900 leading-tight">
                    Kebijakan Netralitas AreaQu
                  </h3>
                  <p className="text-xs text-stone-500">Peraturan Titik Ormas & Partai Politik</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseNeutrality}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center cursor-pointer hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-stone-100 rounded-2xl border border-stone-300 text-xs text-stone-700 space-y-2">
              <p className="font-bold text-stone-900">
                Prinsip Kerukunan Warga & Kemandirian Komunitas:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-stone-600">
                <li>Titik sekretariat partai/ormas hanya ditampilkan sebagai penanda netral.</li>
                <li>Dilarang keras menyewa lapak digital prioritas untuk promosi politik.</li>
                <li>Tidak diperbolehkan memasang iklan kampanye berbayar di radar komunitas.</li>
                <li>Kerahasiaan data warga terlindungi dari eksploitasi politik.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleCloseNeutrality}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-bold text-xs transition-all active:scale-95 cursor-pointer"
            >
              Saya Mengerti & Setuju
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
