import {
    BookCheck,
    BookCopy,
    Folder,
    Home,
    Newspaper,
    Paperclip,
    Text,
    User,
    Users
  } from "lucide-react";
  import { MdClass, MdWorkOutline } from "react-icons/md";

export const Links = [
    {
      pathName: "/dashboard",
      icon: <Home className="h-4 w-4" />,
      label: "Dashboard",
      hasSubLinks: false,
    },
    {
      pathName: "/dashboard/users",
      icon: <Users className="h-4 w-4" />,
      label: "Users",
      hasSubLinks: false,
    },
    {
      pathName: "/dashboard/courses",
      icon: <BookCopy className="h-4 w-4" />,
      label: "Course Management",
      hasSubLinks: true,
      subLinks: [
        {
          pathName: "/dashboard/courses",
          icon: <BookCheck className="h-4 w-4" />,
          label: "Courses",
          hasSubLinks: false,
        },
        {
          pathName: "/dashboard/courses/categories",
          icon: <MdClass className="h-4 w-4" />,
          label: "Course categories",
          hasSubLinks: false,
        }
      ],
    },
    {
      pathName: "/dashboard/jobs",
      icon: <MdWorkOutline className="h-4 w-4" />,
      label: "Jobs",
      hasSubLinks: false,
    },
    {
      pathName: "/dashboard/blog",
      icon: <Newspaper className="h-4 w-4" />,
      label: "Blog Management",
      hasSubLinks: true,
      subLinks: [
        {
          pathName: "/dashboard/blog",
          icon: <Newspaper className="h-4 w-4" />,
          label: "Articles",
          hasSubLinks: false,
        },
        {
          pathName: "/dashboard/blog/categories",
          icon: <Folder className="h-4 w-4" />,
          label: "Article categories",
          hasSubLinks: false,
        }
      ],
    },
    {
      pathName: "/dashboard/profile",
      icon: <User className="h-4 w-4" />,
      label: "Profile",
      hasSubLinks: false,
    },
    {
      pathName: "/dashboard/pages",
      icon: <Paperclip className="h-4 w-4" />,
      label: "User pages",
      hasSubLinks: true,
      subLinks: [
        {
          pathName: "/dashboard/pages/home",
          icon: <Home className="h-4 w-4" />,
          label: "Home",
          hasSubLinks: false,
        },
        {
          pathName: "/dashboard/pages/about",
          icon: <Text className="h-4 w-4" />,
          label: "About",
          hasSubLinks: false,
        },
        {
          pathName: "/dashboard/pages/careers",
          icon: <Text className="h-4 w-4" />,
          label: "Careers",
          hasSubLinks: false,
        },
        {
          pathName: "/dashboard/pages/what-we-do",
          icon: <Text className="h-4 w-4" />,
          label: "What we do",
          hasSubLinks: false,
        },
        {
          pathName: "/dashboard/pages/our-team",
          icon: <Text className="h-4 w-4" />,
          label: "Our team",
          hasSubLinks: false,
        },
        {
          pathName: "/dashboard/pages/contact-us",
          icon: <Text className="h-4 w-4" />,
          label: "Contact US",
          hasSubLinks: false,
        }
      ],
    }
  ]