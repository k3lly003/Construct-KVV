// Fake data for construction specialists for demo purposes
export interface Worker {
  id: string;
  name: string;
  avatar: string; // URL or icon name
  specialist: string;
  email: string;
  phone: string; // new field for phone number
  certified: boolean;
  available: boolean;
  certificateLink?: string; // new field for certificate link
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
    area: string; // new field for area/sector
  };
}

export const workers: Worker[] = [
  {
    id: "1",
    name: "Name Surname",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    specialist: "Architect",
    email: "alice.architect@example.com",
    phone: "+250 788 111 111",
    certified: true,
    available: true,
    certificateLink:
      "https://certificatesinn.com/wp-content/uploads/2022/03/Experience-certificate-for-architect-5CRC.png",
    location: {
      lat: -1.9441,
      lng: 30.0619,
      city: "Kigali",
      country: "Rwanda",
      area: "Kicukiro",
    },
  },
  {
    id: "2",
    name: "Jean Bosco",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    specialist: "Plumber",
    email: "jean.plumber@example.com",
    phone: "+250 788 222 222",
    certified: true,
    available: false,
    certificateLink:
      "https://certificatesinn.com/wp-content/uploads/2022/03/Experience-certificate-for-architect-5CRC.png",
    location: {
      lat: -1.95,
      lng: 30.0588,
      city: "Kigali",
      country: "Rwanda",
      area: "Kicukiro",
    },
  },
  {
    id: "3",
    name: "Claudine Mukamana",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    specialist: "Painter",
    email: "claudine.painter@example.com",
    phone: "+250 788 333 333",
    certified: false,
    available: true,
    certificateLink: "",
    location: {
      lat: -1.97,
      lng: 30.1044,
      city: "Kigali",
      country: "Rwanda",
      area: "Kigali",
    },
  },
  {
    id: "4",
    name: "Eric Niyonzima",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    specialist: "Electrician",
    email: "eric.electrician@example.com",
    phone: "+250 788 444 444",
    certified: true,
    available: true,
    certificateLink:
      "https://certificatesinn.com/wp-content/uploads/2022/03/Experience-certificate-for-architect-5CRC.png",
    location: {
      lat: -1.94,
      lng: 30.089,
      city: "Kigali",
      country: "Rwanda",
      area: "Kigali",
    },
  },
  {
    id: "5",
    name: "Sandrine Uwase",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    specialist: "Contractor",
    email: "sandrine.contractor@example.com",
    phone: "+250 788 555 555",
    certified: true,
    available: false,
    certificateLink:
      "https://certificatesinn.com/wp-content/uploads/2022/03/Experience-certificate-for-architect-5CRC.png",
    location: {
      lat: -1.93,
      lng: 30.06,
      city: "Kigali",
      country: "Rwanda",
      area: "Kigali",
    },
  },
  {
    id: "6",
    name: "Patrick Habimana",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    specialist: "Landscaper",
    email: "patrick.landscaper@example.com",
    phone: "+250 788 666 666",
    certified: false,
    available: true,
    certificateLink: "",
    location: {
      lat: -1.96,
      lng: 30.08,
      city: "Kigali",
      country: "Rwanda",
      area: "Kigali",
    },
  },
  {
    id: "7",
    name: "Diane Ingabire",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    specialist: "Interior Designer",
    email: "diane.interior@example.com",
    phone: "+250 788 777 777",
    certified: true,
    available: true,
    certificateLink:
      "https://certificatesinn.com/wp-content/uploads/2022/03/Experience-certificate-for-architect-5CRC.png",
    location: {
      lat: -1.955,
      lng: 30.065,
      city: "Kigali",
      country: "Rwanda",
      area: "Kigali",
    },
  },
  {
    id: "8",
    name: "Jean Claude",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    specialist: "General Contractor",
    email: "jean.general@example.com",
    phone: "+250 788 888 888",
    certified: true,
    available: true,
    certificateLink:
      "https://certificatesinn.com/wp-content/uploads/2022/03/Experience-certificate-for-architect-5CRC.png",
    location: {
      lat: -1.945,
      lng: 30.075,
      city: "Kigali",
      country: "Rwanda",
      area: "Kigali",
    },
  },
  // Add more workers as needed for demo
];
