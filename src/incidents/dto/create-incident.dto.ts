import { z } from 'zod';

const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
}).optional();

const witnessSchema = z.object({
  name: z.string(),
  contact: z.string(),
});

export const createIncidentSchema = z.object({
  tenant: z.string().min(1, 'Tenant ID is required'),
  site: z.string().min(1, 'Site ID is required'),
  incidentNumber: z.string().min(1, 'Incident Number is required'),
  reportedBy: z.string().min(1, 'Reporter ID is required'),
  incidentType: z.string().min(1, 'Incident Type is required'),
  subType: z.string().min(1, 'Sub Type is required'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  incidentTime: z.coerce.date(),
  location: z.string().min(1, 'Location is required'),
  coordinates: coordinatesSchema,
  witnesses: z.array(witnessSchema).optional(),
  injuries: z.boolean().default(false),
  propertyDamage: z.boolean().default(false),
  emergencyServicesNotified: z.boolean().default(false),
  incidentStatus: z.enum(['REPORTED', 'INVESTIGATING', 'RESOLVED', 'CLOSED']).default('REPORTED'),
  assignedTo: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  resolvedAt: z.coerce.date().optional(),
  resolutionNotes: z.string().optional(),
  clientVisible: z.boolean().default(true),
  photos: z.array(z.string()).optional(),
});

export type CreateIncidentDto = z.infer<typeof createIncidentSchema>;
