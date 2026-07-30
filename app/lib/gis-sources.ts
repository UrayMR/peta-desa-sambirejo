import { getRepresentativeRawPoint, resolveLatLng } from "./geo-utils";

export interface LocationItem {
  id: number;
  name: string;
  pos: [number, number];
  category:
    | "Wisata"
    | "Fasilitas Publik"
    | "Kesehatan"
    | "UMKM & Kuliner"
    | "Tempat Ibadah";
  description: string;
  image: string;
  address: string;
  rating?: number;
}

export interface GisSource {
  file: string;
  name: string;
  category: LocationItem["category"];
  description: string;
  address: string;
  image: string;
}

interface GisFeatureLike {
  geometry?: {
    type?: string;
    coordinates?: unknown;
  };
  properties?: {
    NAMOBJ?: string;
  };
}

export const GIS_SOURCES: GisSource[] = [
  {
    file: "kantor_desa.json",
    name: "Kantor Desa Sambirejo",
    category: "Fasilitas Publik",
    description:
      "Pusat pelayanan administrasi dan pemerintahan masyarakat Desa Sambirejo.",
    address: "Kantor Desa Sambirejo, Wonosalam",
    image:
      "https://plus.unsplash.com/premium_photo-1676657954811-9409c4830467?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFuZ3VuYW58ZW58MHx8MHx8fDA%3D",
  },
  {
    file: "gereja.json",
    name: "Gereja",
    category: "Tempat Ibadah",
    description: "Tempat ibadah umat Kristiani warga Desa Sambirejo.",
    address: "Desa Sambirejo, Wonosalam",
    image:
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=600&q=80",
  },
  {
    file: "masjid.json",
    name: "Masjid",
    category: "Tempat Ibadah",
    description: "Tempat ibadah umat Muslim warga Desa Sambirejo.",
    address: "Desa Sambirejo, Wonosalam",
    image:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80",
  },
  {
    file: "pura.json",
    name: "Pura",
    category: "Tempat Ibadah",
    description: "Tempat ibadah umat Hindu warga Desa Sambirejo.",
    address: "Desa Sambirejo, Wonosalam",
    image:
      "https://plus.unsplash.com/premium_photo-1661878915254-f3163e91d870?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHVyYXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    file: "ponkesdes.json",
    name: "Ponkesdes",
    category: "Kesehatan",
    description:
      "Pelayanan kesehatan dasar bagi warga desa dan pertolongan pertama.",
    address: "Desa Sambirejo, Wonosalam",
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80",
  },
  {
    file: "sekolah_dasar.json",
    name: "Sekolah Dasar",
    category: "Fasilitas Publik",
    description: "Sarana pendidikan dasar bagi anak-anak Desa Sambirejo.",
    address: "Desa Sambirejo, Wonosalam",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
  },
  {
    file: "koperasi_desa.json",
    name: "Koperasi Desa",
    category: "UMKM & Kuliner",
    description: "Lembaga usaha ekonomi masyarakat Desa Sambirejo.",
    address: "Desa Sambirejo, Wonosalam",
    image:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80",
  },
  {
    file: "lapangan_voli.json",
    name: "Lapangan Voli",
    category: "Fasilitas Publik",
    description: "Fasilitas olahraga bola voli untuk warga desa.",
    address: "Desa Sambirejo, Wonosalam",
    image:
      "https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=600&q=80",
  },
  {
    file: "lapangan_andum_alpukat.json",
    name: "Lapangan Andum Alpukat",
    category: "Wisata",
    description:
      "Lokasi tradisi Andum Alpukat, kearifan lokal perayaan panen raya alpukat.",
    address: "Desa Sambirejo, Wonosalam",
    image:
      "https://plus.unsplash.com/premium_photo-1725408037993-f891474828c9?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    file: "sanggar_seni.json",
    name: "Sanggar Seni",
    category: "Wisata",
    description:
      "Sanggar seni dan budaya sebagai wadah pelestarian kesenian lokal.",
    address: "Desa Sambirejo, Wonosalam",
    image:
      "https://images.unsplash.com/photo-1642473194844-c23722ece3b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHNlbml8ZW58MHx8MHx8fDA%3D",
  },
  {
    file: "makam.json",
    name: "Makam",
    category: "Fasilitas Publik",
    description: "Area pemakaman umum Desa Sambirejo.",
    address: "Desa Sambirejo, Wonosalam",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
  },
  {
    file: "umkm.json",
    name: "UMKM",
    category: "UMKM & Kuliner",
    description: "Lembaga usaha ekonomi masyarakat Desa Sambirejo.",
    address: "Desa Sambirejo, Wonosalam",
    image:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80",
  },
];

export async function loadGisLocations(): Promise<LocationItem[]> {
  const results = await Promise.all(
    GIS_SOURCES.map(async (src) => {
      const res = await fetch(`/gis/${src.file}`);
      if (!res.ok) {
        throw new Error(`Gagal memuat ${src.file}`);
      }
      const geojson = await res.json();
      return { src, geojson };
    }),
  );

  const items: LocationItem[] = [];
  let idCounter = 1;

  for (const { src, geojson } of results) {
    const features = Array.isArray(geojson?.features) ? geojson.features : [];
    const crsName: string | undefined = geojson?.crs?.properties?.name;

    if (features.length === 0) {
      console.warn(`[GIS] ${src.file}: tidak ada fitur di dalam file.`);
      continue;
    }

    let validCount = 0;

    features.forEach((feature: GisFeatureLike, idx: number) => {
      const rawPoint = getRepresentativeRawPoint(feature?.geometry);
      if (!rawPoint) {
        // console.warn(
        //   `[GIS] ${src.file} #${idx}: tipe geometry "${feature?.geometry?.type}" belum didukung / kosong, dilewati.`,
        // );
        return;
      }

      const resolved = resolveLatLng(rawPoint, crsName, `${src.file} #${idx}`);
      if (!resolved) {
        // console.warn(
        //   `[GIS] ${src.file} #${idx}: koordinat tidak valid, dilewati.`,
        // );
        return;
      }

      const [lat, lon] = resolved;

      const featureName = feature?.properties?.NAMOBJ?.trim();
      const displayName = featureName
        ? featureName
        : features.length > 1
          ? `${src.name} ${idx + 1}`
          : src.name;

      items.push({
        id: idCounter++,
        name: displayName,
        pos: [lat, lon],
        category: src.category,
        description: src.description,
        image: src.image,
        address: src.address,
      });
      validCount++;
    });

    if (validCount === 0) {
      // console.warn(
      //   `[GIS] ${src.file}: 0 dari ${features.length} fitur berhasil dipetakan.`,
      // );
    }
  }

  return items;
}
