// this code does not have any functionality and is just a referrence to the database model schema
// for the sake of presentation. Will be deleted later.

interface ServiceType {
  id: number;
  tagName: string;
  averageServiceTime: number;
}

interface Counter {
  id: number;
  counterNumber: number;
  services: ServiceType[];
}

interface Ticket {
  id: number;
  ticketCode: string;
  customerId: number; // Foreign key referencing User id
  status: TicketStatus;
  done_on: Date;
}
enum TicketStatus {
  open,
  processing,
  passed,
  fulfilled,
  canceled,
}

interface User {
  id: number;
  type: UserTypes;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

enum UserTypes {
  inactive, // users that are banned by manager/moderator or should not be frozen for any reason
  notVerified, // users who are not yet verified their identity
  customer, // normal customers registered to system to be able to reserve tickets online/offsite
  manager, // managers of the office
  root, // big boss with all access
}

export { ServiceType, Counter, Ticket, User };
