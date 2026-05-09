import { Neighborhood, Outage } from "../types";

export const MOCK_NEIGHBORHOODS: Neighborhood[] = [
  { id:1,  name_pt:"Ingombotas",   name_en:"Ingombotas",   municipality:"Luanda",  latitude:-8.8159, longitude:13.2306, zone_code:"INGO_01", is_active:true },
  { id:2,  name_pt:"Maianga",      name_en:"Maianga",      municipality:"Luanda",  latitude:-8.8270, longitude:13.2420, zone_code:"MAIN_01", is_active:true },
  { id:3,  name_pt:"Rangel",       name_en:"Rangel",       municipality:"Luanda",  latitude:-8.8344, longitude:13.2544, zone_code:"RANG_01", is_active:true },
  { id:4,  name_pt:"Sambizanga",   name_en:"Sambizanga",   municipality:"Luanda",  latitude:-8.8050, longitude:13.2475, zone_code:"SAMB_01", is_active:true },
  { id:5,  name_pt:"Kilamba Kiaxi",name_en:"Kilamba Kiaxi",municipality:"Luanda",  latitude:-8.8620, longitude:13.2820, zone_code:"KIAM_01", is_active:true },
  { id:6,  name_pt:"Cacuaco",      name_en:"Cacuaco",      municipality:"Cacuaco", latitude:-8.7800, longitude:13.3670, zone_code:"CACU_01", is_active:true },
  { id:7,  name_pt:"Viana",        name_en:"Viana",        municipality:"Viana",   latitude:-8.9050, longitude:13.3740, zone_code:"VIAN_01", is_active:true },
  { id:8,  name_pt:"Talatona",     name_en:"Talatona",     municipality:"Belas",   latitude:-8.9540, longitude:13.1970, zone_code:"TALA_01", is_active:true },
  { id:9,  name_pt:"Morro Bento",  name_en:"Morro Bento",  municipality:"Luanda",  latitude:-8.8800, longitude:13.2450, zone_code:"MORB_01", is_active:true },
  { id:10, name_pt:"Cazenga",      name_en:"Cazenga",      municipality:"Cazenga", latitude:-8.8200, longitude:13.2950, zone_code:"CAZE_01", is_active:true },
  { id:11, name_pt:"Benfica",      name_en:"Benfica",      municipality:"Belas",   latitude:-8.9200, longitude:13.2200, zone_code:"BENF_01", is_active:true },
  { id:12, name_pt:"Golfe",        name_en:"Golf Course",  municipality:"Luanda",  latitude:-8.8470, longitude:13.2090, zone_code:"GOLF_01", is_active:true },
  { id:13, name_pt:"Miramar",      name_en:"Miramar",      municipality:"Luanda",  latitude:-8.8100, longitude:13.2320, zone_code:"MIRA_01", is_active:true },
  { id:14, name_pt:"Alvalade",     name_en:"Alvalade",     municipality:"Luanda",  latitude:-8.8380, longitude:13.2190, zone_code:"ALVA_01", is_active:true },
  { id:15, name_pt:"Mutamba",      name_en:"Mutamba",      municipality:"Luanda",  latitude:-8.8188, longitude:13.2360, zone_code:"MUTA_01", is_active:true },
];

function futureISO(hoursFromNow: number): string {
  return new Date(Date.now() + hoursFromNow * 3600000).toISOString();
}

export function getMockOutages(): Outage[] {
  return [
    {
      id:1, neighborhood_id:1, neighborhood: MOCK_NEIGHBORHOODS[0],
      start_time: futureISO(0.5), end_time: futureISO(3.5),
      outage_type:"planned", status:"scheduled",
      reason_pt:"Manutenção na rede eléctrica", reason_en:"Electrical network maintenance",
      created_at: new Date().toISOString(),
    },
    {
      id:2, neighborhood_id:2, neighborhood: MOCK_NEIGHBORHOODS[1],
      start_time: futureISO(-0.75), end_time: futureISO(2),
      outage_type:"unplanned", status:"ongoing",
      reason_pt:null, reason_en:null,
      created_at: new Date().toISOString(),
    },
    {
      id:3, neighborhood_id:5, neighborhood: MOCK_NEIGHBORHOODS[4],
      start_time: futureISO(3), end_time: futureISO(7),
      outage_type:"planned", status:"scheduled",
      reason_pt:"Substituição de transformador", reason_en:"Transformer replacement",
      created_at: new Date().toISOString(),
    },
    {
      id:4, neighborhood_id:7, neighborhood: MOCK_NEIGHBORHOODS[6],
      start_time: futureISO(8), end_time: futureISO(12),
      outage_type:"maintenance", status:"scheduled",
      reason_pt:"Manutenção preventiva", reason_en:"Preventive maintenance",
      created_at: new Date().toISOString(),
    },
    {
      id:5, neighborhood_id:10, neighborhood: MOCK_NEIGHBORHOODS[9],
      start_time: futureISO(24), end_time: futureISO(28),
      outage_type:"planned", status:"scheduled",
      reason_pt:"Obras de expansão", reason_en:"Expansion works",
      created_at: new Date().toISOString(),
    },
  ];
}
