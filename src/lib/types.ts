export type RoleType = "EMS" | "MED" | "DM" | "CSA";

export type DangerLevel = 1 | 2 | 3 | 4;

export interface RoutetreatMap {
  inhalation?: string;
  skin?: string;
  eye?: string;
  ingestion?: string;
}

export interface Medication {
  name: string;
  dose?: string;
  note?: string;
}

export interface EMSProtocol {
  ppe_level: "A" | "B" | "C" | "D";
  self_protection: string[];
  route_treatments: RoutetreatMap;
  field_medications: Medication[];
  transport_criteria: string[];
  absolute_prohibitions: string[];
}

export interface MEDProtocol {
  clinical_symptoms: string[];
  lab_tests: string[];
  antidotes: Medication[];
  admission_criteria: string[];
  icu_criteria: string[];
  delayed_toxicity: string[];
  special_populations: string[];
}

export interface DMProtocol {
  control_zone: string[];
  evacuation_triggers: string[];
  ics_checklist: string[];
  agencies: string[];
  public_communication: string[];
  termination_criteria: string[];
}

export interface CSAProtocol {
  legal_classification: string[];
  report_deadline_hours: number;
  environmental_checks: string[];
  admin_actions: string[];
  dispersion_model?: string;
}

export interface Chemical {
  id: string;
  cas_number: string;
  un_number?: string;
  name_ko: string;
  name_en: string;
  synonyms: string[];
  formula?: string;
  hazard_class: string;
  danger_level: DangerLevel;
  appearance: string;
  odor?: string;
  ems_protocol: EMSProtocol;
  med_protocol: MEDProtocol;
  dm_protocol: DMProtocol;
  csa_protocol: CSAProtocol;
}

export interface AIEstimation {
  chemical_name: string;
  cas_number?: string;
  confidence: "높음" | "중간" | "낮음";
  reasoning: string;
  immediate_actions: string[];
}
