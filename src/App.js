import { useState, useEffect } from 'react';
import './App.css';
import './styles.css';

import { supabase } from './lib/supabaseClient';
import Header from './components/Header';
import Loader from './components/Loader';
import CategoryFilter from './components/CategoryFilter';
import NewFactForm from './components/Facts/NewFactForm';
import FactList from './components/Facts/FactList';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(() => {
    async function getFacts() {
      setIsLoading(true);
      let query = supabase.from('facts').select('*');

      if (currentCategory !== 'all') query = query.eq('category', currentCategory);

      const { data: facts, error } = await query.order('text', { ascending: false }).limit(1000);

      console.log(facts);
      if (!error) setFacts(facts);
      else alert('Error fetching facts');
      setIsLoading(false);
    }
    getFacts();
  }, [currentCategory]);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} setFacts={setFacts} />
      {showForm ? <NewFactForm setFacts={setFacts} setShowForm={setShowForm} /> : null}
      <main className="main">
      <CategoryFilter setCurrentCategory={setCurrentCategory} />
      {/* <FactList facts={facts} /> */}
        {isLoading ? <Loader /> : <FactList facts={facts} currentCategory={currentCategory} />}
       
      </main>
    </>
  );
}

export default App;
