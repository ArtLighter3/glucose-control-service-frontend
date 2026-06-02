import apiClient from '@/service/apiClient.ts'
import {type Page} from '@/util/pagination.ts'
import { getTemplateTypeURLCodename } from '@/util/enumToStringLiterals.ts'
import type { PortionType } from '@/service/diaryService.ts'

export enum TemplateType {
  MEAL = 'MEAL',
  MEDICATION = 'MEDICATION'
}

export interface Template {
  name: string
}

export interface Meal extends Template {
  carbsPer100Grams: number
}

export interface Medication extends Template {
  milligramsInPortion: number | null,
  defaultPortions: number,
  portionType: PortionType
}

const pageSize = import.meta.env.VITE_DEFAULT_FETCH_PAGE_SIZE;

export async function postTemplate(patientId: string, template: Template, type: TemplateType) {
  return apiClient.post<Template>(getTemplateURL(patientId, type), template);
}

export async function putTemplate(patientId: string, template: Template, type: TemplateType) {
  return apiClient.put<Template>(getTemplateURL(patientId, type), template);
}

export async function deleteTemplate(patientId: string, templateName: string, type: TemplateType) {
  return apiClient.delete(getTemplateURL(patientId, type), {
    params: {
      name: templateName
    }
  });
}

export async function getTemplates(patientId: string, type: TemplateType, page: number) {
  return apiClient.get<Page<Template>>(getTemplateURL(patientId, type), {
    params: {
      page: page,
      size: pageSize
    }
  });
}

export async function searchTemplates(patientId: string, type: TemplateType,
                                      query: string, page: number) {
  return apiClient.get<Page<Template>>(getTemplateSearchURL(patientId, type), {
    params: {
      query: query,
      page: page,
      size: pageSize
    }
  });
}

function getTemplateURL(patientId: string, templateType: TemplateType) {
  return `/patients/${patientId}/templates/${getTemplateTypeURLCodename(templateType)}`;
}

function getTemplateSearchURL(patientId: string, templateType: TemplateType) {
  return `/patients/${patientId}/templates/${getTemplateTypeURLCodename(templateType)}/search`;
}




