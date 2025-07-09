import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export function useCategory() {
  const [categories, setCategories] = useState([]);
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
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Log categories whenever they change
  useEffect(() => {
    console.log(categories);
  }, [categories]);

  // Add a new category
  const addCategory = async (name, parentId = null) => {
    setLoading(true);
    setError(null); // Reset error state before adding
    try {
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const newCategory = { name, slug };
      if (parentId) newCategory.parentId = parentId;

      const docRef = await addDoc(collection(db, 'categories'), newCategory);

      // Update parent if this is a subcategory
      if (parentId) {
        await updateDoc(doc(db, 'categories', parentId), {
          subCategories: arrayUnion(docRef.id)
        });
      }

      // Update local state without re-fetching
      setCategories(prev => [...prev, { id: docRef.id, ...newCategory }]);
      
      return docRef.id;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false); // Set loading to false here
    }
  };

  return { categories, loading, error, addCategory, fetchCategories };
}
