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

            setAllCategoriesFlat(categoriesData);
            const structured = structureCategories(categoriesData);
            setCategories(structured);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Structure categories into a tree format
    const structureCategories = (categoriesToStructure) => {
        const categoryMap = {};
        const structuredResult = [];

        // Initialize map with all categories
        categoriesToStructure.forEach(category => {
            categoryMap[category.id] = { ...category, subcategories: [] };
        });

        // Build the tree
        categoriesToStructure.forEach(category => {
            if (category.parentId && categoryMap[category.parentId]) {
                categoryMap[category.parentId].subcategories.push(categoryMap[category.id]);
            } else {
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

    // Add a new category
    const addCategory = async (name, parentId = null) => {
        setLoading(true); // Keep loading true during add operation
        setError(null);
        try {
            const slug = name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            const newCategory = { name, slug };
            if (parentId) newCategory.parentId = parentId;

            const docRef = await addDoc(collection(db, 'categories'), newCategory);

            // Update parent if this is a subcategory (optional: Firebase recommends against nested arrays for large data)
            // Consider if you truly need 'subCategories' array in parent.
            // The structureCategories already builds the tree based on parentId.
            if (parentId) {
                // This line could potentially be removed if you only rely on parentId for tree building
                // and don't need a direct list of subCategory IDs in the parent document.
                // If you keep it, ensure your security rules allow it.
                await updateDoc(doc(db, 'categories', parentId), {
                    subCategories: arrayUnion(docRef.id)
                });
            }

            // After adding, re-fetch all categories to ensure consistency
            await fetchCategories(); // <--- IMPORTANT CHANGE HERE

            return docRef.id; // Return the ID of the newly added category
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false); // End loading after fetch completes
        }
    };

    return { categories, allCategoriesFlat, loading, error, addCategory, fetchCategories };
}