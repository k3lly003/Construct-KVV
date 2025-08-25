import { architectService, Architect } from '@/app/services/architectService'
import { technicianService, Technician } from '@/app/services/technicianService'
import { constructorService, Constructor } from '@/app/services/constructorService'

export type ProfessionalRole = 'ARCHITECT' | 'TECHNICIAN' | 'CONTRACTOR'

export interface Professional {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: ProfessionalRole
  status: string
  createdAt: string
  // Keep original payload for consumers that need full details
  original: Architect | Technician | Constructor
}

function mapArchitects(architects: Architect[]): Professional[] {
  return architects.map((a) => ({
    id: a.id,
    email: a.email,
    firstName: a.firstName,
    lastName: a.lastName,
    phone: a.phone,
    role: 'ARCHITECT',
    status: a.status,
    createdAt: a.createdAt,
    original: a,
  }))
}

function mapTechnicians(technicians: Technician[]): Professional[] {
  return technicians.map((t) => ({
    id: t.id,
    email: t.email,
    firstName: t.firstName,
    lastName: t.lastName,
    phone: t.phone,
    role: 'TECHNICIAN',
    status: t.status,
    createdAt: t.createdAt,
    original: t,
  }))
}

function mapConstructors(constructors: Constructor[]): Professional[] {
  return constructors.map((c) => ({
    id: c.id,
    email: c.email,
    firstName: c.firstName,
    lastName: c.lastName,
    phone: c.phone,
    role: 'CONTRACTOR',
    status: c.status,
    createdAt: c.createdAt,
    original: c,
  }))
}

export const professionalService = {
  async getAll(): Promise<Professional[]> {
    const architectsPromise = architectService
      .getAllArchitects()
      .then((list) => {
        console.log('[FETCH] Architects fetched:', list.length)
        return list
      })
    const techniciansPromise = technicianService
      .getAllTechnicians()
      .then((list) => {
        console.log('[FETCH] Technicians fetched:', list.length)
        return list
      })
    const contractorsPromise = constructorService
      .getAllContractors()
      .then((list) => {
        console.log('[FETCH] Contractors fetched:', list.length)
        return list
      })

    const [architects, technicians, contractors] = await Promise.all([
      architectsPromise,
      techniciansPromise,
      contractorsPromise,
    ])

    return [
      ...mapArchitects(architects),
      ...mapTechnicians(technicians),
      ...mapConstructors(contractors),
    ]
  },

  async updateStatus(
    role: ProfessionalRole,
    id: string,
    status: 'APPROVED' | 'REJECTED' | 'PENDING',
  ): Promise<void> {
    if (role === 'ARCHITECT') {
      await architectService.updateArchitectStatus(id, { status })
      return
    }
    if (role === 'TECHNICIAN') {
      await technicianService.updateTechnicianStatus(id, { status })
      return
    }
    if (role === 'CONTRACTOR') {
      await constructorService.updateContractorStatus(id, { status })
      return
    }
  },
}


