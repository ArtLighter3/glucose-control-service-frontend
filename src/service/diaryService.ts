import { CarbsUnit, type GlucoseUnit } from '@/service/patientProfileService.ts'

export enum MeasurementType {
  AFTER_MEAL = "после еды",
  BEFORE_MEAL = "до еды"
}

export enum InsulinType {
  LONG = "пролонгированный",
  SHORT_CARBS = "компенсирующий",
  SHORT_CORRECTION = "корректирующий",
  SHORT = "короткого действия"
}

export interface DiaryEntry {
  value: number,
  commitedAt: string,
  notes: string
}

export interface GlucoseEntry extends DiaryEntry {
  measurementType: MeasurementType
  glucoseUnits: GlucoseUnit,
}

export interface InsulinEntry extends DiaryEntry {
  insulinType: InsulinType
}

export interface MedicationEntry extends DiaryEntry {
  name: string
}

export interface CarbsEntry extends DiaryEntry {
  carbsUnits: CarbsUnit
}


