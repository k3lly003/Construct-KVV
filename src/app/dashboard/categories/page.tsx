"use client";

import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { GenericButton } from "@/components/ui/generic-button";
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pencil, Trash2, Plus, ChevronDown, Search, Funnel } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { v4 as uuidv4 } from 'uuid';

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  title: string;
  items?: SubCategory[];
  dateCreated?: string; // Expecting date as a string from the database
}

const initialCategories: Category[] = [
  {
    id: uuidv4(),
    title: 'Building Materials',
    items: [
      { id: uuidv4(), name: 'Concrete & Cement' },
      { id: uuidv4(), name: 'Bricks & Blocks' },
      { id: uuidv4(), name: 'Lumber & Timber' },
      { id: uuidv4(), name: 'Steel (structural, rebar)' },
      { id: uuidv4(), name: 'Roofing Materials (tiles, metal sheets, etc.)' },
      { id: uuidv4(), name: 'Insulation (thermal, acoustic)' },
      { id: uuidv4(), name: 'Aggregates (sand, gravel, crushed stone)' },
      { id: uuidv4(), name: 'Doors & Windows (frames, glass)' },
      { id: uuidv4(), name: 'Adhesives & Sealants' },
      { id: uuidv4(), name: 'Drywall & Plasterboard' },
    ],
    dateCreated: '2025-05-10',
  },
  {
    id: uuidv4(),
    title: 'Design',
    items: [
      { id: uuidv4(), name: 'Architectural Design' },
      { id: uuidv4(), name: 'Structural Engineering' },
      { id: uuidv4(), name: 'Interior Design' },
      { id: uuidv4(), name: 'MEP Engineering (Mechanical, Electrical, Plumbing)' },
      { id: uuidv4(), name: 'Landscape Design' },
      { id: uuidv4(), name: '3D Modeling & Visualization' },
      { id: uuidv4(), name: 'Permitting Services' },
      { id: uuidv4(), name: 'Project Planning' },
    ],
    dateCreated: '2025-05-12',
  },
  {
    id: uuidv4(),
    title: "Safety Gear",
    items: [
      { id: uuidv4(), name: "Hard Hats" },
      { id: uuidv4(), name: "Safety Glasses & Goggles" },
      { id: uuidv4(), name: "Gloves (work, chemical, etc.)" },
      { id: uuidv4(), name: "Safety Footwear" },
      { id: uuidv4(), name: "High-Visibility Clothing" },
      { id: uuidv4(), name: "Harnesses & Fall Protection" },
      { id: uuidv4(), name: "Respirators & Masks" },
      { id: uuidv4(), name: "Ear Protection" }
    ],
    dateCreated: '2025-05-12',
  },
  {
    id: uuidv4(),
    title: "Electrical",
    items: [
      { id: uuidv4(), name: "Wiring & Cables" },
      { id: uuidv4(), name: "Lighting Fixtures" },
      { id: uuidv4(), name: "Switches & Outlets" },
      { id: uuidv4(), name: "Distribution Boards & Panels" },
      { id: uuidv4(), name: "Conduit & Trunking" },
      { id: uuidv4(), name: "Generators & UPS Systems" },
      { id: uuidv4(), name: "Security Systems (alarms, CCTV)" },
      { id: uuidv4(), name: "Smart Home Systems" }
    ],
    dateCreated: '2025-05-12',
  },
  {
    id: uuidv4(),
    title: "Plumbing",
    items: [
      { id: uuidv4(), name: "Pipes & Fittings (PVC, copper, etc.)" },
      { id: uuidv4(), name: "Sanitaryware (toilets, sinks, showers)" },
      { id: uuidv4(), name: "Water Heaters" },
      { id: uuidv4(), name: "Pumps & Valves" },
      { id: uuidv4(), name: "Drainage Systems" },
      { id: uuidv4(), name: "Irrigation Systems" }
    ],
    dateCreated: '2025-05-12',
  },
  {
    id: uuidv4(),
    title: "Finishing Materials",
    items: [
      { id: uuidv4(), name: "Paints & Coatings" },
      { id: uuidv4(), name: "Flooring (tiles, wood, carpet, laminate)" },
      { id: uuidv4(), name: "Wallpapers & Wall Coverings" },
      { id: uuidv4(), name: "Ceiling Finishes (gypsum boards, suspended ceilings)" },
      { id: uuidv4(), name: "Countertops" },
      { id: uuidv4(), name: "Cabinets & Joinery" },
      { id: uuidv4(), name: "Fixtures & Fittings (door handles, etc.)" }
    ],
    dateCreated: '2025-05-12',
  }
];

const CategoriesTablePage = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newSubCategories, setNewSubCategories] = useState<string[]>(['']);

  const filteredCategories = categories
    .filter((category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((category) => !categoryFilter || category.title === categoryFilter);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilter = (categoryTitle: string | null) => {
    setCategoryFilter(categoryTitle);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleAddSubCategoryInput = () => {
    setNewSubCategories([...newSubCategories, '']);
  };

  const handleSubCategoryInputChange = (index: number, value: string) => {
    const updatedSubCategories = [...newSubCategories];
    updatedSubCategories[index] = value;
    setNewSubCategories(updatedSubCategories);
  };

  const handleRemoveSubCategoryInput = (index: number) => {
    if (newSubCategories.length > 1) {
      const updatedSubCategories = [...newSubCategories];
      updatedSubCategories.splice(index, 1);
      setNewSubCategories(updatedSubCategories);
    } else {
      setNewSubCategories(['']);
    }
  };

  const handleAddCategory = () => {
    if (newCategoryTitle.trim()) {
      const newCategory: Category = {
        id: uuidv4(),
        title: newCategoryTitle.trim(),
        items: newSubCategories
          .map(sub => sub.trim())
          .filter(sub => sub !== '')
          .map(name => ({ id: uuidv4(), name })),
        dateCreated: new Date().toLocaleDateString(),
      };
      setCategories([...categories, newCategory]);
      setOpenAddDialog(false);
      setNewCategoryTitle('');
      setNewSubCategories(['']);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Product Categories</h1>
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <GenericButton>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </GenericButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category-title" className="text-right">
                  Category Title
                </Label>
                <Input
                  id="category-title"
                  className="col-span-3"
                  value={newCategoryTitle}
                  onChange={(e) => setNewCategoryTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sub-categories">Sub-categories (optional)</Label>
                {newSubCategories.map((sub, index) => (
                  <div key={index} className="flex items-center space-x-2 my-3">
                    <Input
                      type="text"
                      placeholder="Sub-category name"
                      value={sub}
                      onChange={(e) => handleSubCategoryInputChange(index, e.target.value)}
                    />
                    {newSubCategories.length > 1 || index > 0 ? (
                      <GenericButton type="button" className='bg-red-500 hover:bg-red-600 text-white' size="sm" onClick={() => handleRemoveSubCategoryInput(index)}>
                        <Trash2 className="h-4 w-4" />
                      </GenericButton>
                    ) : null}
                  </div>
                ))}
                <GenericButton type="button" variant="secondary" size="sm" className="mt-2" onClick={handleAddSubCategoryInput}>
                  Add Sub-category
                </GenericButton>
              </div>
            </div>
            <div className="flex justify-end">
              <GenericButton variant="secondary" onClick={() => setOpenAddDialog(false)}>
                Cancel
              </GenericButton>
              <GenericButton className="ml-2" onClick={handleAddCategory}>
                Add Category
              </GenericButton>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4 flex items-center md:justify-between space-x-2">
        <div className="relative w-full md:w-1/3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </span>
          <Input
            type="search"
            placeholder="Search categories..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <GenericButton variant="outline">
              <Funnel className="h-4 w-4 mr-2 md:mr-0" />
              <span className='hidden md:inline'>Filter Category</span>
              <ChevronDown className="h-4 w-4 ml-2 md:mr-0" />
            </GenericButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => handleCategoryFilter(null)}>All Categories</DropdownMenuItem>
            {initialCategories.map((cat) => (
              <DropdownMenuItem key={cat.id} onClick={() => handleCategoryFilter(cat.title)}>
                {cat.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className='text-amber-300'>
              <TableHead className='text-amber-300'>Category Name</TableHead>
              <TableHead className='text-amber-300'>Sub-categories</TableHead>
              <TableHead className='text-amber-300'>Date Created</TableHead>
              <TableHead className='text-amber-300 text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium py-4">{category.title}</TableCell>
                <TableCell className="py-4">
                  {category.items && category.items.length > 0 ? (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <GenericButton variant="link" size="sm" className="p-0">
                            {category.items[0].name}
                            {category.items.length > 1 && <span className="text-muted-foreground ml-1">+{category.items.length - 1}</span>}
                          </GenericButton>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className='text-amber-500'>Sub-categories for {category.title}</DialogTitle>
                          </DialogHeader>
                          <ul className="list-disc pl-5 py-2">
                            {category.items.map((sub) => (
                              <li className="py-2" key={sub.id}>{sub.name}</li>
                            ))}
                          </ul>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : (
                    <span className="text-muted-foreground italic">No sub-categories</span>
                  )}
                </TableCell>
                <TableCell className='py-4'>{category.dateCreated}</TableCell>
                <TableCell className='py-4 text-right'>
                  <GenericButton size="sm" variant="ghost" className="mr-2">
                    <Pencil className="h-4 w-4" />
                  </GenericButton>
                  <GenericButton size="sm" className='bg-red-500 hover:bg-red-600 text-white' onClick={() => handleDeleteCategory(category.id)}>
                    <Trash2 className="h-4 w-4" />
                  </GenericButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredCategories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategoriesTablePage;
