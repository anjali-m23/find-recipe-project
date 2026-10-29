import axios from 'axios';
import React, { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';









function Home() {
    const [recipes, setRecipes] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errMsg, setErroMsg] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    async function fetchRecipies(skipCount, query = "") {
        setLoading(true);
        setErroMsg("");

        try {
            let url = `https://dummyjson.com/recipes?limit=6&skip=${skipCount}`;

            if (query.trim()) {
                url = `https://dummyjson.com/recipes/search?limit=6&skip=${skipCount}&q=${encodeURIComponent(query.trim())}`;
            }

            const { data } = await axios.get(url);

            setRecipes((prev) =>
                skipCount === 0
                    ? data.recipes
                    : [...prev, ...data.recipes]
            );

            setTotal(data.total);
        } catch (error) {
            setErroMsg("Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRecipies(0);
    }, []);

    function handalSearch(e) {
        e.preventDefault();

        const form = new FormData(e.target);
        const query = form.get("query").trim();

        setSearchQuery(query);
        fetchRecipies(0, query);
    }

    if (errMsg) {
        return (
            <main className="max-w-6xl mx-auto px-4 py-8">
                <p className="text-accent text-center">
                    {errMsg}
                </p>

                <button
                    type="button"
                    onClick={() => fetchRecipies(0, searchQuery)}
                    className="block mx-auto mt-4 bg-accent text-white rounded px-4 py-2"
                >
                    Try Again
                </button>
            </main>
        );
    }

    return (
        <main className="max-w-6xl mx-auto px-4 py-8">
            {loading && recipes.length === 0 && (
                <p className="text-center py-6 text-muted">
                    Loading....
                </p>
            )}

            <form
                onSubmit={handalSearch}
                className="flex gap-2 max-w-md mx-auto mb-8"
            >
                <input
                    type="text"
                    name="query"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border border-border rounded px-3 py-2"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-accent hover:bg-accent-hover text-white rounded px-4 py-2 font-medium disabled:opacity-50"
                >
                    Search
                </button>
            </form>

            {!loading && recipes.length === 0 && (
                <div className="text-center py-6">
                    <p className="text-center py-6 text-muted">
                        {`No Recipe found for '${searchQuery}'`}
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setSearchQuery("");
                            fetchRecipies(0, "");
                        }}
                        className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium"
                    >
                        Back to Recipes
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                    />
                ))}
            </div>

            {loading && recipes.length > 0 && (
                <p className="text-center py-6 text-muted">
                    Loading....
                </p>
            )}

            {!loading && recipes.length < total && (
                <div className="text-center mt-8">
                    <button
                        type="button"
                        onClick={() =>
                            fetchRecipies(recipes.length, searchQuery)
                        }
                        className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium"
                    >
                        Load More
                    </button>
                </div>
            )}
        </main>
    );
}

export default Home;
