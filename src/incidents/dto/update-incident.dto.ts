import { z } from 'zod';

const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
}).optional();

const witnessSchema = z.object({
  name: z.string(),
  contact: z.string(),
});

export const updateIncidentSchema = z.object({
  tenant: z.string().min(1, 'Tenant ID is required').optional(),
  site: z.string().min(1, 'Site ID is required').optional(),
  incidentNumber: z.string().min(1, 'Incident Number is required').optional(),
  reportedBy: z.string().min(1, 'Reporter ID is required').optional(),
  incidentType: z.string().min(1, 'Incident Type is required').optional(),
  subType: z.string().min(1, 'Sub Type is required').optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  incidentTime: z.coerce.date().optional(),
  location: z.string().min(1, 'Location is required').optional(),
  coordinates: coordinatesSchema,
  witnesses: z.array(witnessSchema).optional(),
  injuries: z.boolean().optional(),
  propertyDamage: z.boolean().optional(),
  emergencyServicesNotified: z.boolean().optional(),
  incidentStatus: z.enum(['REPORTED', 'INVESTIGATING', 'RESOLVED', 'CLOSED']).optional(),
  assignedTo: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  resolvedAt: z.coerce.date().optional(),
  resolutionNotes: z.string().optional(),
  clientVisible: z.boolean().optional(),
  photos: z.array(z.string()).optional(),
});

export type UpdateIncidentDto = z.infer<typeof updateIncidentSchema>;
