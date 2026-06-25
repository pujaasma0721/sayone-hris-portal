// Dropdown option lists — mirrors the backend's admin employee form options.
// Source: SayOne-HRIS src/main/resources/templates/admin/new-employee.html

export interface SelectOption {
  value: string
  label: string
}

export const GENDER_OPTIONS: SelectOption[] = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
]

export const BLOOD_TYPE_OPTIONS: SelectOption[] = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'AB', label: 'AB' },
  { value: 'O', label: 'O' },
]

export const RELIGION_OPTIONS: SelectOption[] = [
  { value: 'ISLAM', label: 'Islam' },
  { value: 'KRISTEN', label: 'Kristen' },
  { value: 'KATOLIK', label: 'Katolik' },
  { value: 'HINDU', label: 'Hindu' },
  { value: 'BUDDHA', label: 'Buddha' },
  { value: 'KONGHUCU', label: 'Konghucu' },
]

export const MARITAL_STATUS_OPTIONS: SelectOption[] = [
  { value: 'SINGLE', label: 'Single' },
  { value: 'MARRIED', label: 'Married' },
  { value: 'DIVORCED', label: 'Divorced' },
  { value: 'WIDOWED', label: 'Widowed' },
]

export const EDUCATION_LEVEL_OPTIONS: SelectOption[] = [
  { value: 'SD', label: 'SD' },
  { value: 'SMP', label: 'SMP' },
  { value: 'SMA', label: 'SMA/SMK' },
  { value: 'D3', label: 'D3' },
  { value: 'S1', label: 'S1' },
  { value: 'S2', label: 'S2' },
  { value: 'S3', label: 'S3' },
]

export const EMERGENCY_RELATION_OPTIONS: SelectOption[] = [
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Parent', label: 'Parent' },
  { value: 'Sibling', label: 'Sibling' },
  { value: 'Child', label: 'Child' },
  { value: 'Friend', label: 'Friend' },
  { value: 'Other', label: 'Other' },
]

// Common nationalities (the backend loads these from a `countries` table;
// these are the most common ones for Indonesian HR context).
export const NATIONALITY_OPTIONS: SelectOption[] = [
  { value: 'Indonesian', label: 'Indonesian' },
  { value: 'WNI', label: 'WNI (Warga Negara Indonesia)' },
  { value: 'WNA', label: 'WNA (Warga Negara Asing)' },
  { value: 'Malaysian', label: 'Malaysian' },
  { value: 'Singaporean', label: 'Singaporean' },
  { value: 'Indian', label: 'Indian' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Filipino', label: 'Filipino' },
  { value: 'Vietnamese', label: 'Vietnamese' },
  { value: 'Thai', label: 'Thai' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'American', label: 'American' },
  { value: 'British', label: 'British' },
  { value: 'Australian', label: 'Australian' },
  { value: 'German', label: 'German' },
  { value: 'Dutch', label: 'Dutch' },
  { value: 'Other', label: 'Other' },
]
