export type Service = {
      id?: string;
      _id?: string;
      name: string;
      description: string;
      basePrice: number;
      estimatedDuration: string;
      category: string;
      availability: { day: string; startTime: string; endTime: string }[];
      additionalTasks: {
        description: string;
        extraPrice: number;
        timeAdded?: string;
      }[];
      location: { coordinates: [number, number] };
      address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
      tags: string[];
    };