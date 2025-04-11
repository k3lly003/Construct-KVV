export const Links = [
    {
        name: 'About us',
        link: "/",
        submenu: true,
        sublinks: [
            {
                Head: "Learn more about us",
                sublink: [
                    {
                        name: 'Our story',
                        link: "/about-us"
                    },
                    {
                        name: 'What we do',
                        link: "/what-we-do"
                    },
                    {
                        name: 'Our team',
                        link: "/our-team"
                    }
                ]
            },
        ]
    },
    {
        name: 'Careers',
        link: "/",
        submenu: true,
        sublinks: [
            {
                Head: "Job vacancies",
                sublink: [
                    {
                        name: 'View jobs',
                        link: "/careers"
                    }
                ]
            },
            {
                Head: "Hire our alumni",
                sublink: [
                    {
                        name: 'Hire',
                        link: "/contact-us"
                    }
                ]
            },
        ]
    }
];