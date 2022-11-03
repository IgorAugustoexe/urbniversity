export type Driver = {
    id: string,
    cnh: string,
    route: Rota,
    user: User,
    vehicle: Vehicle
}
export type Student = {
    id: string,
	course: string,
	universityId: string,
	driverId?: string | undefined,
    address?:Address,
    university?:University,
    user:User,
}
export type Rota = {
    id: string,
    cityId: string,
    universityId: string,
    driverId: string,
    city: City,
    university: University,
}
export type City = {
    id: string,
    name: string,
    state: string
}
export type University = {
    id: string,
    name: string
}
export type User = {
    id: string,
    fullName: string,
    phone: string,
    photo:string,
    cpf: string,
    email: string,
    studentId?: string | undefined,
    driverId?: string | undefined
}
export type Vehicle = {
    id: string,
    crlv: string,
    brand: string,
    model: string,
    year: Number,
    color: string,
    seats: string,
    plate:string
    driverId: string
}
export type Address = {
    id: string,
	street: string,
	number: string,
	district: string,
	cep: string,
	cityId: string,
	studentId: string,
	city: City,
}
export type Requests = {
		id: string,
		studentId: string,
		driverId: string,
		driver: {
			id: string,
			cnh: string,
			user: User
		},
		student: Student
}
