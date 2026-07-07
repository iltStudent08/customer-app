export interface Customer {
	id: number;
	name: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	zip: string;
}

export type CustomerFormData = Omit<Customer, "id">;

export type CustomerSortField = 'name' | 'email' | 'phone' | 'city';
