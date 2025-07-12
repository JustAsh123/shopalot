import { useEffect, useState } from "react";
import { useCategory } from "../context/useCategory";
import { useProducts } from "../context/useProducts";
import { Link } from "react-router-dom"; // Assuming you might want to link categories later
import { useAuth } from "../context/useAuth"; // Import useAuth for isDark state

// Helper function (can be defined here or in a utils file)
const getRandomItem = (arr) => {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
};

function Homepage() {
    const { isDark } = useAuth(); // Get isDark state
    // --- Category and Product Data Fetching ---
    const { categories, loading: categoriesLoading, error: categoryError } = useCategory();
    const { prods: allProducts, loading: productsLoading, error: productsError } = useProducts();

    // --- Loading and Error Handling ---
    if (categoriesLoading || productsLoading) {
        return (
            <div className={`flex justify-center items-center h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <p className={`text-xl font-medium ${isDark ? 'text-white' : 'text-black'}`}>Loading amazing categories...</p>
            </div>
        );
    }

    if (categoryError || productsError) {
        return (
            <div className={`text-center py-12 ${isDark ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-700'} border-l-4 border-red-500 p-4 mx-auto max-w-lg rounded-md shadow-sm`}>
                <p className="font-semibold mb-2">Oops! Something went wrong.</p>
                <p>Error loading content: {categoryError?.message || productsError?.message}. Please try again later.</p>
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className={`flex justify-center items-center h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'} ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                <p className="text-xl">No categories found to display.</p>
            </div>
        );
    }

    // --- Data Preparation: Map products to subcategories for easy lookup ---
    const productsBySubcategory = allProducts.reduce((acc, product) => {
        if (product.subcategoryId) { // Assuming your products have a subcategoryId field
            if (!acc[product.subcategoryId]) {
                acc[product.subcategoryId] = [];
            }
            acc[product.subcategoryId].push(product);
        }
        return acc;
    }, {});

    return (
        <div className={`container mx-auto px-4 py-8 shadow-lg rounded-lg my-4 ${isDark ? ' text-white' : ' text-black'}`}>
            <h1 className="text-4xl font-extrabold text-center mb-12 tracking-tight">
                Shop by Category
            </h1>

            {categories.map(category => (
                <section key={category.id} className="mb-16">
                    <h2 className={`text-3xl font-bold mb-8 border-b-2 ${isDark ? 'border-primary-500' : 'border-primary-700'} pb-3`}>
                        {category.name}
                    </h2>

                    {category.subcategories && category.subcategories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {category.subcategories.map(subcategory => {
                                const productsInSubcategory = productsBySubcategory[subcategory.id];
                                const randomProduct = getRandomItem(productsInSubcategory);
                                const productCount = productsInSubcategory ? productsInSubcategory.length : 0;

                                return (
                                    <Link
                                        to={`/category/${subcategory.id}`} // Example: navigate to /category/laptops
                                        key={subcategory.id}
                                        className={`block rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-400'} border-base-300 shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
                                    >
                                        <div className="w-full h-48 sm:h-56 overflow-hidden">
                                            <img
                                                src={randomProduct?.imageUrl || 'https://via.placeholder.com/400x300/F3F4F6/6B7280?text=No+Image'}
                                                alt={randomProduct?.name || subcategory.name}
                                                className="w-full h-full object-contain bg-white transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-5">
                                            <h3 className={`text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors duration-200`}>
                                                {subcategory.name}
                                            </h3>
                                            <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {productCount > 0 ? `Shop ${productCount} items` : 'No products yet'}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <p className={`italic mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No subcategories found for {category.name}.</p>
                    )}
                </section>
            ))}
        </div>
    );
}

export default Homepage;
