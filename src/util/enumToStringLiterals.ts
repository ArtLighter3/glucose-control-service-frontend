import type { MeasurementType } from '@/service/diaryService.ts'
import { DiaryEntryType, InsulinType } from '@/service/diaryService.ts'
import type { CarbsUnit } from '@/service/patientProfileService.ts'
import { GlucoseUnit } from '@/service/patientProfileService.ts'
import type { Role } from '@/service/userService.ts'

interface EnumStringRepresentation {
  [key: string]: string;
}

const entryTypeToURL: EnumStringRepresentation = {
  "GLUCOSE_ENTRY": "glucose",
  "CARBS_ENTRY": "carbs",
  "INSULIN_ENTRY": "insulin",
  "MEDICATION_ENTRY": "medication",
};

const insulinTypeToStringRepresentation: EnumStringRepresentation = {
  "SHORT": "Короткого действия",
  "LONG": "Пролонгированный",
  "SHORT_CARBS": "Компенсирующий",
  "SHORT_CORRECTION": "Корректирующий",
};

const measurementTypeToStringRepresentation: EnumStringRepresentation = {
  "BEFORE_MEAL": "До еды",
  "AFTER_MEAL": "После еды",
};

const glucoseUnitToStringRepresentation: EnumStringRepresentation = {
  "MILLIMOLES_PER_LITER": "ммоль/л",
  "MILLIGRAMS_PER_DECILITER": "мг/дл"
};

const carbsUnitToStringRepresentation: EnumStringRepresentation = {
  "GRAMS": "грамм",
  "BREAD_UNITS_10": "хлебная единица (10г)",
  "BREAD_UNITS_12": "хлебная единица (12г)",
  "BREAD_UNITS_15": "хлебная единица (15г)"
};

const carbsUnitToShortStringRepresentation: EnumStringRepresentation = {
  "GRAMS": "г",
  "BREAD_UNITS_10": "ХЕ",
  "BREAD_UNITS_12": "ХЕ",
  "BREAD_UNITS_15": "ХЕ"
};

const roleToRoleStringRepresentation: EnumStringRepresentation = {
  "ROLE_PATIENT": "Больной",
  "ROLE_DOCTOR": "Врач",
  "ROLE_ADMIN": "Администратор"
};

function getOrEmptyString(mappedType: EnumStringRepresentation, key: string | null | undefined) {
  if (key === null || key === undefined) return "";

  const value = mappedType[key];
  if (value === undefined) return "";

  return value;
}

export function getMeasurementTypeName(category: MeasurementType | null | undefined) {
  return getOrEmptyString(measurementTypeToStringRepresentation, category);
}

export function getInsulinTypeName(insulinType: InsulinType | null | undefined) {
  return getOrEmptyString(insulinTypeToStringRepresentation, insulinType);
}

export function getDiaryEntryTypeURLCodename(entryType: DiaryEntryType | null | undefined) {
  return getOrEmptyString(entryTypeToURL, entryType);
}

export function getCarbsUnitName(carbsUnit: CarbsUnit | null | undefined) {
  return getOrEmptyString(carbsUnitToStringRepresentation, carbsUnit);
}

export function getCarbsUnitShortName(carbsUnit: CarbsUnit | null | undefined) {
  return getOrEmptyString(carbsUnitToShortStringRepresentation, carbsUnit);
}

export function getGlucoseUnitName(glucoseUnit: GlucoseUnit | null | undefined) {
  return getOrEmptyString(glucoseUnitToStringRepresentation, glucoseUnit);
}

export function getRoleName(role: Role | null | undefined) {
  return getOrEmptyString(roleToRoleStringRepresentation, role);
}
