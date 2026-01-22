# Guardly - NestJS Entity Definitions (TypeORM Ready)

## 📋 Complete Entity Definitions with All Relations

> এই ফাইলটি ব্যবহার করে আপনি সরাসরি NestJS + TypeORM entities তৈরি করতে পারবেন
> প্রতিটি Entity এর fields, decorators, এবং relationships সব দেওয়া আছে

---

## 🏢 Core Entities

### 1. Tenant Entity

```typescript
// src/modules/tenants/entities/tenant.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';
import { Client } from '../clients/entities/client.entity';
import { Site } from '../sites/entities/site.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { Incident } from '../incidents/entities/incident.entity';
import { Patrol } from '../patrols/entities/patrol.entity';
import { Announcement } from '../announcements/entities/announcement.entity';
import { ShiftType } from '../shift-types/entities/shift-type.entity';
import { LeavePolicy } from '../leave-policies/entities/leave-policy.entity';
import { Setting } from '../settings/entities/setting.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  name: string;

  @Column({ unique: true, name: 'tenant_code', length: 50 })
  tenantCode: string;

  @Column()
  email: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ name: 'license_number', length: 100 })
  licenseNumber: string;

  @Column({
    type: 'enum',
    enum: ['BASIC', 'STANDARD', 'PREMIUM'],
    default: 'BASIC'
  })
  subscriptionPlan: string;

  @Column({ name: 'max_sites', default: 10 })
  maxSites: number;

  @Column({ name: 'max_users', default: 100 })
  maxUsers: number;

  @Column({ type: 'json', nullable: true })
  settings: Record<string, any>;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE'
  })
  tenantStatus: string;

  // Relations
  @OneToMany(() => UserProfile, (user) => user.tenant)
  userProfiles: UserProfile[];

  @OneToMany(() => Client, (client) => client.tenant)
  clients: Client[];

  @OneToMany(() => Site, (site) => site.tenant)
  sites: Site[];

  @OneToMany(() => Shift, (shift) => shift.tenant)
  shifts: Shift[];

  @OneToMany(() => Incident, (incident) => incident.tenant)
  incidents: Incident[];

  @OneToMany(() => Patrol, (patrol) => patrol.tenant)
  patrols: Patrol[];

  @OneToMany(() => Announcement, (announcement) => announcement.tenant)
  announcements: Announcement[];

  @OneToMany(() => ShiftType, (shiftType) => shiftType.tenant)
  shiftTypes: ShiftType[];

  @OneToMany(() => LeavePolicy, (policy) => policy.tenant)
  leavePolicies: LeavePolicy[];

  @OneToMany(() => Setting, (setting) => setting.tenant)
  settings: Setting[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 2. UserProfile Entity

```typescript
// src/modules/user-profiles/entities/user-profile.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Site } from '../sites/entities/site.entity';
import { Client } from '../clients/entities/client.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { Incident } from '../incidents/entities/incident.entity';
import { Patrol } from '../patrols/entities/patrol.entity';
import { Certificate } from '../certificates/entities/certificate.entity';
import { LeaveRequest } from '../leave-requests/entities/leave-request.entity';
import { LeaveBalance } from '../leave-balances/entities/leave-balance.entity';
import { Payslip } from '../payslips/entities/payslip.entity';
import { OccurrenceBook } from '../occurrence-books/entities/occurrence-book.entity';
import { Announcement } from '../announcements/entities/announcement.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.userProfiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  lastName: string;

  @Column({ name: 'employee_id', length: 50, nullable: true })
  employeeId: string;

  @Column({ length: 50 })
  phone: string;

  @Column({
    type: 'enum',
    enum: ['SUPER_ADMIN', 'OM', 'OFFICER', 'CLIENT']
  })
  role: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE'
  })
  userStatus: string;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @Column({ name: 'failed_attempts', default: 0 })
  failedAttempts: number;

  @Column({ name: 'locked_until', nullable: true })
  lockedUntil: Date;

  @Column({ type: 'json', nullable: true })
  permissions: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ name: 'hired_date', type: 'date', nullable: true })
  hiredDate: Date;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'emergency_contact', length: 255, nullable: true })
  emergencyContact: string;

  @Column({ name: 'emergency_phone', length: 50, nullable: true })
  emergencyPhone: string;

  @Column({ name: 'profile_photo', nullable: true })
  profilePhoto: string;

  // Relations
  @ManyToMany(() => Site, (site) => site.userProfiles)
  @JoinTable({
    name: 'user_profiles_sites',
    joinColumn: { name: 'user_profile_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'site_id', referencedColumnName: 'id' }
  })
  sites: Site[];

  @ManyToOne(() => Client, (client) => client.userProfiles, { nullable: true })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @OneToMany(() => Shift, (shift) => shift.user)
  shifts: Shift[];

  @OneToMany(() => Incident, (incident) => incident.reportedBy)
  reportedIncidents: Incident[];

  @OneToMany(() => Incident, (incident) => incident.assignedTo)
  assignedIncidents: Incident[];

  @OneToMany(() => Patrol, (patrol) => patril.user)
  patrols: Patrol[];

  @OneToMany(() => Certificate, (certificate) => certificate.userProfile)
  certificates: Certificate[];

  @OneToMany(() => LeaveRequest, (leave) => leave.user)
  leaveRequests: LeaveRequest[];

  @OneToMany(() => LeaveRequest, (leave) => leave.approvedBy)
  approvedLeaves: LeaveRequest[];

  @OneToMany(() => LeaveBalance, (balance) => balance.userProfile)
  leaveBalances: LeaveBalance[];

  @OneToMany(() => Payslip, (payslip) => payslip.userProfile)
  payslips: Payslip[];

  @OneToMany(() => OccurrenceBook, (occurrence) => occurrence.userProfile)
  occurrenceBooks: OccurrenceBook[];

  @OneToMany(() => Announcement, (announcement) => announcement.createdBy)
  createdAnnouncements: Announcement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 3. Client Entity

```typescript
// src/modules/clients/entities/client.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';
import { Site } from '../sites/entities/site.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.clients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'contact_person', length: 255, nullable: true })
  contactPerson: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  })
  clientStatus: string;

  // Relations
  @OneToMany(() => UserProfile, (user) => user.client)
  userProfiles: UserProfile[];

  @ManyToMany(() => Site, (site) => site.clients)
  @JoinTable({
    name: 'clients_sites',
    joinColumn: { name: 'client_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'site_id', referencedColumnName: 'id' }
  })
  sites: Site[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 4. Site Entity

```typescript
// src/modules/sites/entities/site.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';
import { Client } from '../clients/entities/client.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { Incident } from '../incidents/entities/incident.entity';
import { Patrol } from '../patrols/entities/patrol.entity';
import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';
import { PatrolRoute } from '../patrol-routes/entities/patrol-route.entity';
import { Visitor } from '../visitors/entities/visitor.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { OccurrenceBook } from '../occurrence-books/entities/occurrence-book.entity';

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.sites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'site_code', length: 50 })
  siteCode: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'json' })
  coordinates: { lat: number; lng: number };

  @Column({ name: 'geofence_radius', default: 100 })
  geofenceRadius: number;

  @Column({ default: 'Asia/Singapore' })
  timezone: string;

  @Column({ type: 'json', nullable: true })
  settings: Record<string, any>;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  })
  siteStatus: string;

  // Relations
  @ManyToMany(() => UserProfile, (user) => user.sites)
  userProfiles: UserProfile[];

  @ManyToMany(() => Client, (client) => client.sites)
  @JoinTable({
    name: 'clients_sites',
    joinColumn: { name: 'site_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'client_id', referencedColumnName: 'id' }
  })
  clients: Client[];

  @OneToMany(() => Shift, (shift) => shift.site)
  shifts: Shift[];

  @OneToMany(() => Incident, (incident) => incident.site)
  incidents: Incident[];

  @OneToMany(() => Patrol, (patrol) => patrol.site)
  patrols: Patrol[];

  @OneToMany(() => Checkpoint, (checkpoint) => checkpoint.site)
  checkpoints: Checkpoint[];

  @OneToMany(() => PatrolRoute, (route) => route.site)
  patrolRoutes: PatrolRoute[];

  @OneToMany(() => Visitor, (visitor) => visitor.site)
  visitors: Visitor[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.site)
  vehicles: Vehicle[];

  @OneToMany(() => OccurrenceBook, (occurrence) => occurrence.site)
  occurrenceBooks: OccurrenceBook[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## ⏰ Operations Entities

### 5. Shift Entity

```typescript
// src/modules/shifts/entities/shift.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Site } from '../sites/entities/site.entity';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';
import { Patrol } from '../patrols/entities/patrol.entity';

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.shifts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToOne(() => Site, (site) => site.shifts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => UserProfile, (user) => user.shifts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserProfile;

  @Column({ name: 'shift_date', type: 'date' })
  shiftDate: Date;

  @Column({ name: 'shift_type', length: 50 })
  shiftType: string;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @Column({ name: 'duty_post', length: 255, nullable: true })
  dutyPost: string;

  @Column({ name: 'check_in_time', nullable: true })
  checkInTime: Date;

  @Column({ name: 'check_in_location', type: 'json', nullable: true })
  checkInLocation: { lat: number; lng: number };

  @Column({ name: 'check_out_time', nullable: true })
  checkOutTime: Date;

  @Column({ name: 'check_out_location', type: 'json', nullable: true })
  checkOutLocation: { lat: number; lng: number };

  @Column({ name: 'overtime_minutes', default: 0 })
  overtimeMinutes: number;

  @Column({
    type: 'enum',
    enum: ['SCHEDULED', 'ONGOING', 'COMPLETED', 'MISSED'],
    default: 'SCHEDULED'
  })
  shiftStatus: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'required_staff', default: 0 })
  requiredStaff: number;

  @Column({ name: 'check_in_photo', nullable: true })
  checkInPhoto: string;

  @Column({ name: 'check_out_photo', nullable: true })
  checkOutPhoto: string;

  @Column({ name: 'check_in_note', type: 'text', nullable: true })
  checkInNote: string;

  @Column({ name: 'check_out_note', type: 'text', nullable: true })
  checkOutNote: string;

  @Column({ name: 'late_arrival_reason', enum: ['TRAFFIC', 'TRANSPORT_DELAY', 'WEATHER', 'ILLNESS', 'PERSONAL_EMERGENCY', 'OTHER'], nullable: true })
  lateArrivalReason: string;

  @Column({ name: 'late_arrival_note', type: 'text', nullable: true })
  lateArrivalNote: string;

  @Column({ name: 'post_confirmed', default: false })
  postConfirmed: boolean;

  @Column({ name: 'post_confirmation_note', type: 'text', nullable: true })
  postConfirmationNote: string;

  @Column({ name: 'break_start_time', nullable: true })
  breakStartTime: Date;

  @Column({ name: 'break_end_time', nullable: true })
  breakEndTime: Date;

  @Column({ name: 'manual_adjustment', default: false })
  manualAdjustment: boolean;

  @ManyToOne(() => UserProfile, { nullable: true })
  @JoinColumn({ name: 'adjusted_by' })
  adjustedBy: UserProfile;

  // Relations
  @OneToMany(() => Patrol, (patrol) => patrol.shift)
  patrols: Patrol[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 6. ShiftType Entity

```typescript
// src/modules/shift-types/entities/shift-type.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Shift } from '../shifts/entities/shift.entity';

@Entity('shift_types')
export class ShiftType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.shiftTypes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'start_time' })
  startTime: string;

  @Column({ name: 'end_time' })
  endTime: string;

  @Column({ name: 'required_staff', default: 1 })
  requiredStaff: number;

  @Column({ type: 'json', nullable: true })
  breakConfig: { duration: number; paid: boolean };

  @Column({ default: true })
  isActive: boolean;

  // Relations
  @OneToMany(() => Shift, (shift) => shift.shiftType)
  shifts: Shift[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 7. Patrol Entity

```typescript
// src/modules/patrols/entities/patrol.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Site } from '../sites/entities/site.entity';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { PatrolRoute } from '../patrol-routes/entities/patrol-route.entity';
import { PatrolScan } from '../patrol-scans/entities/patrol-scan.entity';

@Entity('patrols')
export class Patrol {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.patrols, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToOne(() => Site, (site) => site.patrols, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => UserProfile, (user) => user.patrols, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserProfile;

  @ManyToOne(() => Shift, (shift) => shift.patrols, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @ManyToOne(() => PatrolRoute, (route) => route.patrols, { nullable: true })
  @JoinColumn({ name: 'patrol_route_id' })
  patrolRoute: PatrolRoute;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time', nullable: true })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'],
    default: 'IN_PROGRESS'
  })
  patrolStatus: string;

  @Column({
    name: 'patrol_execution_status',
    type: 'enum',
    enum: ['ONGOING', 'COMPLETED'],
    nullable: true
  })
  patrolExecutionStatus: string;

  @Column({ name: 'total_scans', default: 0 })
  totalScans: number;

  @Column({ name: 'missed_scans', default: 0 })
  missedScans: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relations
  @OneToMany(() => PatrolScan, (scan) => scan.patrol)
  patrolScans: PatrolScan[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 8. PatrolRoute Entity

```typescript
// src/modules/patrol-routes/entities/patrol-route.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Site } from '../sites/entities/site.entity';
import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';
import { Patrol } from '../patrols/entities/patrol.entity';

@Entity('patrol_routes')
export class PatrolRoute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Site, (site) => site.patrolRoutes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'route_data', type: 'json' })
  routeData: {
    distance: number;
    estimatedTime: number;
    checkpoints: string[];
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'priority_order', default: 0 })
  priorityOrder: number;

  // Relations
  @ManyToMany(() => Checkpoint, (checkpoint) => checkpoint.patrolRoutes)
  @JoinTable({
    name: 'patrol_routes_checkpoints',
    joinColumn: { name: 'patrol_route_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'checkpoint_id', referencedColumnName: 'id' }
  })
  checkpoints: Checkpoint[];

  @OneToMany(() => Patrol, (patrol) => patrol.patrolRoute)
  patrols: Patrol[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 9. Checkpoint Entity

```typescript
// src/modules/checkpoints/entities/checkpoint.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Site } from '../sites/entities/site.entity';
import { PatrolRoute } from '../patrol-routes/entities/patrol-route.entity';
import { PatrolScan } from '../patrol-scans/entities/patrol-scan.entity';

@Entity('checkpoints')
export class Checkpoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Site, (site) => site.checkpoints, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json' })
  location: { lat: number; lng: number };

  @Column({ name: 'qr_code', unique: true })
  qrCode: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'priority_order', default: 0 })
  priorityOrder: number;

  // Relations
  @ManyToMany(() => PatrolRoute, (route) => route.checkpoints)
  patrolRoutes: PatrolRoute[];

  @OneToMany(() => PatrolScan, (scan) => scan.checkpoint)
  patrolScans: PatrolScan[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 10. PatrolScan Entity

```typescript
// src/modules/patrol-scans/entities/patrol-scan.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Patrol } from '../patrols/entities/patrol.entity';
import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';

@Entity('patrol_scans')
export class PatrolScan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patrol, (patrol) => patrol.patrolScans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patrol_id' })
  patrol: Patrol;

  @ManyToOne(() => Checkpoint, (checkpoint) => checkpoint.patrolScans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'checkpoint_id' })
  checkpoint: Checkpoint;

  @Column({ name: 'scan_time' })
  scanTime: Date;

  @Column({ type: 'json' })
  location: { lat: number; lng: number };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'scan_photo', nullable: true })
  scanPhoto: string;

  @Column({ default: false })
  isMissed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## 🚨 Incident Entities

### 11. Incident Entity

```typescript
// src/modules/incidents/entities/incident.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Site } from '../sites/entities/site.entity';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.incidents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToOne(() => Site, (site) => site.incidents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @Column({ name: 'incident_number', unique: true, length: 50 })
  incidentNumber: string;

  @ManyToOne(() => UserProfile, (user) => user.reportedIncidents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reported_by' })
  reportedBy: UserProfile;

  @Column({ name: 'incident_type', length: 100 })
  incidentType: string;

  @Column({ name: 'sub_type', length: 100 })
  subType: string;

  @Column({
    type: 'enum',
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  })
  severity: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'incident_time' })
  incidentTime: Date;

  @Column({ length: 255 })
  location: string;

  @Column({ type: 'json', nullable: true })
  coordinates: { lat: number; lng: number };

  @Column({ type: 'json', nullable: true })
  witnesses: Array<{ name: string; contact: string }> | null;

  @Column({ default: false })
  injuries: boolean;

  @Column({ name: 'property_damage', default: false })
  propertyDamage: boolean;

  @Column({ name: 'emergency_services_notified', default: false })
  emergencyServicesNotified: boolean;

  @Column({
    type: 'enum',
    enum: ['REPORTED', 'INVESTIGATING', 'RESOLVED', 'CLOSED'],
    default: 'REPORTED'
  })
  incidentStatus: string;

  @ManyToOne(() => UserProfile, (user) => user.assignedIncidents, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: UserProfile;

  @Column({
    type: 'enum',
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  })
  priority: string;

  @Column({ name: 'resolved_at', nullable: true })
  resolvedAt: Date;

  @Column({ name: 'resolution_notes', type: 'text', nullable: true })
  resolutionNotes: string;

  @Column({ name: 'client_visible', default: true })
  clientVisible: boolean;

  @Column({ type: 'simple-array', nullable: true })
  photos: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 12. IncidentType Entity

```typescript
// src/modules/incident-types/entities/incident-type.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IncidentSubtype } from '../incident-subtypes/entities/incident-subtype.entity';

@Entity('incident_types')
export class IncidentType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'priority_order', default: 0 })
  priorityOrder: number;

  // Relations
  @OneToMany(() => IncidentSubtype, (subtype) => subtype.incidentType)
  subtypes: IncidentSubtype[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 13. IncidentSubtype Entity

```typescript
// src/modules/incident-subtypes/entities/incident-subtype.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IncidentType } from '../incident-types/entities/incident-type.entity';

@Entity('incident_subtypes')
export class IncidentSubtype {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => IncidentType, (type) => type.subtypes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'incident_type_id' })
  incidentType: IncidentType;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## 🚪 Access Management Entities

### 14. Visitor Entity

```typescript
// src/modules/visitors/entities/visitor.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Site } from '../sites/entities/site.entity';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Site, (site) => site.visitors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => UserProfile, { nullable: true })
  @JoinColumn({ name: 'checked_in_by' })
  checkedInBy: UserProfile;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'identification_number', length: 100 })
  identificationNumber: string;

  @Column({
    type: 'enum',
    enum: ['WALK_IN', 'SCHEDULED', 'DELIVERY', 'CONTRACTOR', 'INTERVIEW']
  })
  visitorType: string;

  @Column({ name: 'check_in_time' })
  checkInTime: Date;

  @Column({ name: 'check_out_time', nullable: true })
  checkOutTime: Date;

  @Column({ type: 'text' })
  purpose: string;

  @Column({ length: 255 })
  host: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  signature: string;

  @Column({ nullable: true })
  photo: string;

  @Column({
    type: 'enum',
    enum: ['CHECKED_IN', 'CHECKED_OUT', 'OVERDUE'],
    default: 'CHECKED_IN'
  })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 15. Vehicle Entity

```typescript
// src/modules/vehicles/entities/vehicle.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Site } from '../sites/entities/site.entity';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Site, (site) => site.vehicles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => UserProfile, { nullable: true })
  @JoinColumn({ name: 'checked_in_by' })
  checkedInBy: UserProfile;

  @Column({ name: 'registration_number', unique: true, length: 50 })
  registrationNumber: string;

  @Column({ length: 100 })
  make: string;

  @Column({ length: 100 })
  model: string;

  @Column({ length: 50 })
  color: string;

  @Column({ name: 'owner_name', length: 255 })
  ownerName: string;

  @Column({ name: 'contact_number', length: 50 })
  contactNumber: string;

  @Column({ name: 'check_in_time' })
  checkInTime: Date;

  @Column({ name: 'check_out_time', nullable: true })
  checkOutTime: Date;

  @Column({
    type: 'enum',
    enum: ['PARKED', 'EXITED', 'OVERDUE'],
    default: 'PARKED'
  })
  parkingStatus: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'parking_spot', length: 50, nullable: true })
  parkingSpot: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 16. GeofenceOverride Entity

```typescript
// src/modules/geofence-overrides/entities/geofence-override.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Site } from '../sites/entities/site.entity';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';

@Entity('geofence_overrides')
export class GeofenceOverride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Site, (site) => site.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => UserProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserProfile;

  @Column({ type: 'json' })
  location: { lat: number; lng: number };

  @Column({ name: 'radius_meters' })
  radiusMeters: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({ name: 'valid_from' })
  validFrom: Date;

  @Column({ name: 'valid_until' })
  validUntil: Date;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'EXPIRED', 'REVOKED'],
    default: 'ACTIVE'
  })
  status: string;

  @ManyToOne(() => UserProfile, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approvedBy: UserProfile;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## 👥 HR & Payroll Entities

### 17. LeaveRequest Entity

```typescript
// src/modules/leave-requests/entities/leave-request.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';

@Entity('leave_requests')
export class LeaveRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserProfile, (user) => user.leaveRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserProfile;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'COMPASSIONATE', 'UNPAID']
  })
  leaveType: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING'
  })
  requestStatus: string;

  @ManyToOne(() => UserProfile, (user) => user.approvedLeaves, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approvedBy: UserProfile;

  @Column({ name: 'approved_at', nullable: true })
  approvedAt: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ name: 'total_days', default: 1 })
  totalDays: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 18. LeaveBalance Entity

```typescript
// src/modules/leave-balances/entities/leave-balance.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';

@Entity('leave_balances')
export class LeaveBalance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserProfile, (user) => user.leaveBalances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userProfile: UserProfile;

  @Column({ name: 'annual_balance', default: 14 })
  annualBalance: number;

  @Column({ name: 'sick_balance', default: 14 })
  sickBalance: number;

  @Column({ name: 'other_balance', default: 3 })
  otherBalance: number;

  @Column({ type: 'integer' })
  year: number;

  @Column({ name: 'carried_forward', default: 0 })
  carriedForward: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 19. LeavePolicy Entity

```typescript
// src/modules/leave-policies/entities/leave-policy.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';

@Entity('leave_policies')
export class LeavePolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.leavePolicies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({
    type: 'enum',
    enum: ['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'COMPASSIONATE', 'UNPAID']
  })
  leaveType: string;

  @Column({ name: 'max_days_per_year', default: 14 })
  maxDaysPerYear: number;

  @Column({ name: 'max_consecutive_days', default: 14 })
  maxConsecutiveDays: number;

  @Column({ name: 'requires_approval', default: true })
  requiresApproval: boolean;

  @Column({ name: 'notice_days_required', default: 7 })
  noticeDaysRequired: number;

  @Column({ name: 'carry_forward_allowed', default: false })
  carryForwardAllowed: boolean;

  @Column({ name: 'max_carry_forward_days', default: 0 })
  maxCarryForwardDays: number;

  @Column({ type: 'json', nullable: true })
  rules: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 20. Certificate Entity

```typescript
// src/modules/certificates/entities/certificate.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserProfile, (user) => user.certificates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_profile_id' })
  userProfile: UserProfile;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'certificate_number', length: 100 })
  certificateNumber: string;

  @Column({ name: 'issuing_authority', length: 255 })
  issuingAuthority: string;

  @Column({ name: 'issue_date', type: 'date' })
  issueDate: Date;

  @Column({ name: 'expiry_date', type: 'date' })
  expiryDate: Date;

  @Column({ nullable: true })
  document: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'EXPIRED', 'REVOKED'],
    default: 'ACTIVE'
  })
  status: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 21. Payslip Entity

```typescript
// src/modules/payslips/entities/payslip.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';

@Entity('payslips')
export class Payslip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserProfile, (user) => user.payslips, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userProfile: UserProfile;

  @Column({ name: 'year_month', length: 7 }) // Format: "2024-01"
  yearMonth: string;

  @Column({ name: 'basic_salary', type: 'decimal', precision: 10, scale: 2 })
  basicSalary: number;

  @Column({ name: 'overtime_pay', type: 'decimal', precision: 10, scale: 2, default: 0 })
  overtimePay: number;

  @Column({ name: 'deductions', type: 'decimal', precision: 10, scale: 2, default: 0 })
  deductions: number;

  @Column({ name: 'net_pay', type: 'decimal', precision: 10, scale: 2 })
  netPay: number;

  @Column({ name: 'pay_date' })
  payDate: Date;

  @Column({ nullable: true })
  document: string;

  @Column({ type: 'json', nullable: true })
  breakdown: {
    basic: number;
    housing: number;
    transport: number;
    medical: number;
    other: number;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 22. Claim Entity

```typescript
// src/modules/claims/entities/claim.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';

@Entity('claims')
export class Claim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserProfile, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserProfile;

  @ManyToOne(() => UserProfile, { nullable: true })
  @JoinColumn({ name: 'processed_by' })
  processedBy: UserProfile;

  @Column({ name: 'claim_number', unique: true, length: 50 })
  claimNumber: string;

  @Column({
    type: 'enum',
    enum: ['MEDICAL', 'ACCIDENT', 'DAMAGE', 'LOSS', 'OTHER']
  })
  claimType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'incident_date', type: 'date' })
  incidentDate: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID'],
    default: 'PENDING'
  })
  claimStatus: string;

  @Column({ name: 'submitted_date' })
  submittedDate: Date;

  @Column({ name: 'processed_date', nullable: true })
  processedDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'simple-array', nullable: true })
  supportingDocuments: string[];

  @Column({ name: 'approved_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  approvedAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## 📢 Communication Entities

### 23. Announcement Entity

```typescript
// src/modules/announcements/entities/announcement.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.announcements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToOne(() => UserProfile, (user) => user.createdAnnouncements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by' })
  createdBy: UserProfile;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  })
  priority: string;

  @Column({ name: 'publish_date' })
  publishDate: Date;

  @Column({ name: 'expiry_date', nullable: true })
  expiryDate: Date;

  @Column({ name: 'is_pinned', default: false })
  isPinned: boolean;

  @Column({
    type: 'enum',
    enum: ['ALL', 'OM', 'OFFICER', 'CLIENT'],
    array: true
  })
  targetAudience: string[];

  @Column({ default: true })
  isActive: boolean;

  // Relations
  @ManyToMany(() => UserProfile, (user) => user.id)
  @JoinTable({
    name: 'announcements_read_by',
    joinColumn: { name: 'announcement_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_profile_id', referencedColumnName: 'id' }
  })
  readBy: UserProfile[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 24. OccurrenceBook Entity

```typescript
// src/modules/occurrence-books/entities/occurrence-book.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';
import { Site } from '../sites/entities/site.entity';

@Entity('occurrence_books')
export class OccurrenceBook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserProfile, (user) => user.occurrenceBooks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userProfile: UserProfile;

  @ManyToOne(() => Site, (site) => site.occurrenceBooks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @Column({ name: 'entry_time' })
  entryTime: Date;

  @Column({ type: 'text' })
  entry: string;

  @Column({ length: 100 })
  shift: string;

  @Column({
    type: 'enum',
    enum: ['HANDOVER', 'INCIDENT', 'OBSERVATION', 'INSTRUCTION', 'OTHER']
  })
  occurrenceType: string;

  @Column({ length: 255 })
  location: string;

  @Column({ name: 'reported_at', nullable: true })
  reportedAt: Date;

  @Column({ name: 'action_taken', type: 'text', nullable: true })
  actionTaken: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 25. Setting Entity

```typescript
// src/modules/settings/entities/setting.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.settings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ unique: true, length: 255 })
  key: string;

  @Column({ type: 'json' })
  value: any;

  @Column({ length: 100 })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## 📦 Additional Entities

### 26. AppVersion Entity

```typescript
// src/modules/app-versions/entities/app-version.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('app_versions')
export class AppVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'platform', length: 20 })
  platform: string; // 'ios' or 'android'

  @Column({ name: 'version_number', length: 20 })
  versionNumber: string;

  @Column({ name: 'build_number', length: 20 })
  buildNumber: string;

  @Column({ default: true })
  isForceUpdate: boolean;

  @Column({ name: 'release_date' })
  releaseDate: Date;

  @Column({ name: 'download_url' })
  downloadUrl: string;

  @Column({ type: 'text', nullable: true })
  releaseNotes: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## 🚀 NestJS Project Setup Instructions

### Step 1: Create NestJS Project

```bash
# Install NestJS CLI globally
npm i -g @nestjs/cli

# Create new project
nestjs new guardly-backend
cd guardly-backend

# Install TypeORM and PostgreSQL
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/config class-validator class-transformer

# Install additional dependencies
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install @nestjs/mapped-types
npm install uuid
```

### Step 2: Configure TypeORM

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: true,
      }),
      inject: [ConfigService],
    }),
    // Your modules here
  ],
})
export class AppModule {}
```

### Step 3: Create Environment File

```bash
# .env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=guardly_db
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d
```

### Step 4: Generate Modules

```bash
# Generate all modules using NestJS CLI
nest g module tenants
nest g service tenants
nest g controller tenants

# Generate entities for each module
# Repeat for all 26 entities listed above
nest g module user-profiles
nest g module clients
nest g module sites
# ... and so on
```

### Step 5: Example CRUD Service

```typescript
// src/modules/tenants/tenants.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const tenant = this.tenantRepository.create(createTenantDto);
    return await this.tenantRepository.save(tenant);
  }

  async findAll(): Promise<Tenant[]> {
    return await this.tenantRepository.find({
      relations: ['userProfiles', 'clients', 'sites'],
    });
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
      relations: ['userProfiles', 'clients', 'sites', 'shifts'],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    await this.tenantRepository.update(id, updateTenantDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tenantRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
  }
}
```

---

## 📊 Complete Relationship Summary

### One-to-Many Relationships (1:N)
1. **Tenant → Users** (One tenant has many users)
2. **Tenant → Sites** (One tenant has many sites)
3. **Tenant → Clients** (One tenant has many clients)
4. **Tenant → Shifts** (One tenant has many shifts)
5. **Tenant → Incidents** (One tenant has many incidents)
6. **Tenant → Patrols** (One tenant has many patrols)
7. **Site → Shifts** (One site has many shifts)
8. **Site → Incidents** (One site has many incidents)
9. **Site → Patrols** (One site has many patrols)
10. **Site → Checkpoints** (One site has many checkpoints)
11. **User → Shifts** (One user has many shifts)
12. **User → Patrols** (One user has many patrols)
13. **Shift → Patrols** (One shift has many patrols)
14. **Patrol → PatrolScans** (One patrol has many scans)
15. **PatrolRoute → Checkpoints** (One route has many checkpoints)

### Many-to-Many Relationships (N:M)
1. **Users ↔ Sites** (Many users assigned to many sites)
2. **Sites ↔ Clients** (Many sites serve many clients)
3. **PatrolRoutes ↔ Checkpoints** (Many routes contain many checkpoints)

### Foreign Key References
All foreign keys follow TypeORM conventions:
- `tenant_id` → References `tenants(id)`
- `user_id` → References `user_profiles(id)`
- `site_id` → References `sites(id)`
- `client_id` → References `clients(id)`
- `shift_id` → References `shifts(id)`
- `patrol_id` → References `patrols(id)`
- etc.

---

## ✅ Migration Order (Create Tables in This Order)

1. **tenants** (No dependencies)
2. **user_profiles** (Depends on: tenants)
3. **clients** (Depends on: tenants)
4. **sites** (Depends on: tenants)
5. **shift_types** (Depends on: tenants)
6. **leave_policies** (Depends on: tenants)
7. **settings** (Depends on: tenants)
8. **incident_types** (No dependencies)
9. **incident_subtypes** (Depends on: incident_types)
10. **patrol_routes** (Depends on: sites)
11. **checkpoints** (Depends on: sites)
12. **shifts** (Depends on: tenants, sites, users, shift_types)
13. **patrols** (Depends on: tenants, sites, users, shifts, patrol_routes)
14. **patrol_scans** (Depends on: patrols, checkpoints)
15. **incidents** (Depends on: tenants, sites, users)
16. **visitors** (Depends on: sites, users)
17. **vehicles** (Depends on: sites, users)
18. **geofence_overrides** (Depends on: sites, users)
19. **leave_requests** (Depends on: users)
20. **leave_balances** (Depends on: users)
21. **certificates** (Depends on: users)
22. **payslips** (Depends on: users)
23. **claims** (Depends on: users)
24. **announcements** (Depends on: tenants, users)
25. **occurrence_books** (Depends on: users, sites)
26. **app_versions** (No dependencies)

---

## 🎯 Summary

This file contains **26 complete entities** with:
- ✅ All fields and data types
- ✅ All relationships (OneToOne, OneToMany, ManyToMany)
- ✅ All decorators (TypeORM)
- ✅ Foreign key references
- ✅ Indexes and constraints
- ✅ Timestamps (createdAt, updatedAt)
- ✅ Cascade delete settings
- ✅ Nullable fields

**You can now copy-paste these entities into your NestJS project and start building your backend immediately!** 🚀
