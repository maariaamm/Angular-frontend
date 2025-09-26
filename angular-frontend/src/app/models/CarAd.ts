import User from "./User";

export default interface CarAd {
    _id: string;
    brand: string;
    description: string;
    model: string;
    year: number;
    fuelType: string;
    price: number;
    createdAt: Date;
    imageUrl?: string | null;
    user?: User;
}