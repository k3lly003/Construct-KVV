export interface Testimonial {
    rating: number;
    quote: string;
    picture: string;
    author: string;
}

export const testimonials: Testimonial[] = [
    { rating: 4.0, quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper.', picture:'', author: 'Ethan Miller' },
    { rating: 4.5, quote: 'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.', picture:'', author: 'Olivia White' },
    { rating: 4.2, quote: 'Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo.', picture:'', author: 'Noah Green' },
];