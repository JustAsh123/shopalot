import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export function useCategory() {
  const [categories, setCategories] = useState([]); // This will be the structured tree
  const [allCategoriesFlat, setAllCategoriesFlat] = useState([]); // This will be a flat list for easy lookup
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from Firestore
  const fetchCategories = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Set the flat list directly from fetched data
      setAllCategoriesFlat(categoriesData);

      // Structure categories into a tree format for other uses (if needed)
      const structured = structureCategories(categoriesData);
      setCategories(structured); // Update the structured state
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Structure categories into a tree format (remains the same)
  const structureCategories = (categoriesToStructure) => {
    const categoryMap = {};
    const structuredResult = [];

    // Initialize map with all categories
    categoriesToStructure.forEach(category => {
      categoryMap[category.id] = { ...category, subcategories: [] };
    });

    // Build the tree
    categoriesToStructure.forEach(category => {
      if (category.parentId && categoryMap[category.parentId]) { // Ensure parent exists in map
        categoryMap[category.parentId].subcategories.push(categoryMap[category.id]);
      } else {
        // Only push top-level categories (those without a parentId or with an invalid parentId)
        // to the structuredResult array.
        // This implicitly handles cases where a parentId might point to a non-existent category
        // by making the child a top-level category in the structured view.
        if (!category.parentId) {
            structuredResult.push(categoryMap[category.id]);
        }
      }
    });

    return structuredResult;
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Log categories whenever they change (for debugging, optional)
  useEffect(() => {
    console.log("Structured Categories:", categories);
    console.log("Flat Categories for Lookup:", allCategoriesFlat);
  }, [categories, allCategoriesFlat]);

  // Add a new category
  const addCategory = async (name, parentId = null) => {
    setLoading(true);
    setError(null);
    try {
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const newCategory = { name, slug };
      if (parentId) newCategory.parentId = parentId;

      const docRef = await addDoc(collection(db, 'categories'), newCategory);
      const newCategoryData = { id: docRef.id, ...newCategory };

      // Update parent if this is a subcategory
      if (parentId) {
        await updateDoc(doc(db, 'categories', parentId), {
          subCategories: arrayUnion(docRef.id)
        });
      }

      // Update local state by adding to flat list and then re-structuring
      setAllCategoriesFlat(prev => [...prev, newCategoryData]);
      setCategories(prev => structureCategories([...allCategoriesFlat, newCategoryData])); // Important: use the updated flat list here

      return docRef.id;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Return both structured categories and the flat list
  return { categories, allCategoriesFlat, loading, error, addCategory, fetchCategories };
}