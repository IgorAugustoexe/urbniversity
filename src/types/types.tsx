export type Routes = {
        
    id: string,
    cnh: string,
    route: {
        id: string,
        cityId: string,
        universityId: string,
        driverId: string,
        city: {
            id: string,
            name: string,
            state: string
        }
        university: {
            id: string,
            name: string
        } 
    }
    user: {
        id: string,
        fullName: string,
        phone: string,
        cpf: string,
        email: string,
        studentId: null,
        driverId: string
    },
    vehicle: {
        id: string,
        crlv: string,
        brand: string,
        model: string,
        year: number,
        color: string,
        seats: string,
        driverId: string
    }
}