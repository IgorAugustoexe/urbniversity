export type Driver = {
    id: String,
    cnh: String,
    route: Rota,
    user: User,
    vehicle: Vehicle
}
export type Student = {
    id: String,
	course: String,
	universityId: String,
	driverId?: String | undefined,
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
    id: String,
    fullName: String,
    phone: String,
    cpf: String,
    email: String,
    studentId?: String | undefined,
    driverId?: String | undefined
}
export type Vehicle = {
    id: String,
    crlv: String,
    brand: String,
    model: String,
    year: Number,
    color: String,
    seats: string,
    driverId: String
}
export type Address = {
    id: String,
	street: String,
	number: String,
	district: String,
	cep: String,
	cityId: String,
	studentId: String,
	city: City,
}
export type Requests = {
		id: String,
		studentId: String,
		driverId: String,
		driver: {
			id: String,
			cnh: String,
			user: User
		},
		student: Student
}
