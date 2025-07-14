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
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { useCategories } from '@/app/hooks/useCategories';
import { toast } from 'sonner';
import { useTranslations } from '@/app/hooks/useTranslations';

const CategoriesTablePage = () => {
  const { categories, createCategory, deleteCategory } = useCategories();
  const { t } = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newSubCategories, setNewSubCategories] = useState<string[]>(['']);

  // @typescript-eslint/no-unused-vars
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success(t('categories.deleteSuccess'));
    } catch {
      toast.error(t('categories.deleteError'));
    }
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

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        await createCategory(
          newCategoryName.trim(),
          newCategoryDescription.trim(),
          newSubCategories
        );
        setOpenAddDialog(false);
        setNewCategoryName('');
        setNewCategoryDescription('');
        setNewSubCategories(['']);
        toast.success(t('categories.createSuccess'));
      } catch {
        toast.error(t('categories.createError'));
      }
    }
  };

  const parentCategories = categories.filter(cat => !cat.parentId);
  const subCategoriesMap = categories
    .filter(cat => typeof cat.parentId === "string" && cat.parentId)
    .reduce((acc, sub) => {
      if (!acc[sub.parentId!]) acc[sub.parentId!] = [];
      acc[sub.parentId!].push(sub);
      return acc;
    }, {} as Record<string, typeof categories>);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">{t('categories.title')}</h1>
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <GenericButton>
              <Plus className="h-4 w-4 mr-2" />
              {t('categories.addCategory')}
            </GenericButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('categories.addNewCategory')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category-name" className="text-right">
                  {t('categories.categoryName')}
                </Label>
                <Input
                  id="category-name"
                  className="col-span-3"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category-description" className="text-right">
                  {t('categories.description')}
                </Label>
                <Textarea
                  id="category-description"
                  className="col-span-3"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder={t('categories.descriptionPlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="sub-categories">{t('categories.subCategories')}</Label>
                {newSubCategories.map((sub, index) => (
                  <div key={index} className="flex items-center space-x-2 my-3">
                    <Input
                      type="text"
                      placeholder={t('categories.subCategoryPlaceholder')}
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
                  {t('categories.addSubCategory')}
                </GenericButton>
              </div>
            </div>
            <div className="flex justify-end">
              <GenericButton variant="secondary" onClick={() => setOpenAddDialog(false)}>
                {t('common.cancel')}
              </GenericButton>
              <GenericButton className="ml-2" onClick={handleAddCategory}>
                {t('categories.addCategory')}
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
            placeholder={t('categories.searchPlaceholder')}
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <GenericButton variant="outline">
              <Funnel className="h-4 w-4 mr-2 md:mr-0" />
              <span className='hidden md:inline'>{t('categories.filterCategory')}</span>
              <ChevronDown className="h-4 w-4 ml-2 md:mr-0" />
            </GenericButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {/* Category filter removed as categoryFilter is unused */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className='text-amber-300'>
              <TableHead className='text-amber-300'>{t('categories.categoryName')}</TableHead>
              <TableHead className='text-amber-300'>{t('categories.description')}</TableHead>
              <TableHead className='text-amber-300'>{t('categories.subCategories')}</TableHead>
              <TableHead className='text-amber-300'>{t('categories.dateCreated')}</TableHead>
              <TableHead className='text-amber-300 text-right'>{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parentCategories.map((parent) => (
              <TableRow key={parent.id}>
                <TableCell className="font-medium py-4">{parent.name}</TableCell>
                <TableCell className="py-4">{parent.description}</TableCell>
                <TableCell className="py-4">
                  {subCategoriesMap[parent.id] && subCategoriesMap[parent.id].length > 0 ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <GenericButton variant="link" size="sm" className="p-0">
                          {subCategoriesMap[parent.id][0].name}
                          {subCategoriesMap[parent.id].length > 1 && (
                            <span className="text-muted-foreground ml-1">
                              +{subCategoriesMap[parent.id].length - 1}
                            </span>
                          )}
                        </GenericButton>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className='text-amber-500'>
                            {t('categories.subCategoriesFor', { name: parent.name })}
                          </DialogTitle>
                        </DialogHeader>
                        <ul className="list-disc pl-5 py-2">
                          {subCategoriesMap[parent.id].map((sub) => (
                            <li className="py-2" key={sub.id}>{sub.name}</li>
                          ))}
                        </ul>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <span className="text-muted-foreground italic">{t('categories.noSubCategories')}</span>
                  )}
                </TableCell>
                <TableCell className='py-4'>{parent.dateCreated}</TableCell>
                <TableCell className='py-4 text-right'>
                  <GenericButton size="sm" variant="ghost" className="mr-2">
                    <Pencil className="h-4 w-4" />
                  </GenericButton>
                  <GenericButton size="sm" className='bg-red-500 hover:bg-red-600 text-white' onClick={() => handleDeleteCategory(parent.id)}>
                    <Trash2 className="h-4 w-4" />
                  </GenericButton>
                </TableCell>
              </TableRow>
            ))}
            {parentCategories.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  {t('categories.noCategoriesFound')}
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
