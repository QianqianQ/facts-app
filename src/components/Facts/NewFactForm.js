
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { CATEGORIES } from '../../lib/constants';
import { isValidUrl } from '../../lib/utils';


function NewFactForm({ setFacts, setShowForm }) {
    const [text, setText] = useState('');
    const [source, setSource] = useState('http://example.com');
    const [category, setCategory] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const textLength = text.length;
  
    async function handleSubmit(e) {
      // prevent browser reload
      e.preventDefault();
      console.log(text, source, category);
      // check data validity
      if (text && isValidUrl(source) && category && textLength <= 200 && isValidUrl(source)) {
        // add new fact to supabase
        setIsUploading(true);
        const { data: newFact, error } = await supabase.from('facts').insert([{text, source, category}]).select();
        console.log(newFact);
        // add new fact to ui
        if (!error) setFacts(facts => [newFact[0], ...facts]);
        else alert('Error posting fact');
        setIsUploading(false);
        // reset input fields
        setText('');
        setSource('');
        setCategory('');
        // close the form
        setShowForm(false);
      }
    }
  
    return (
      <form className="fact-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Share a fact with the world..." 
        value={text} onChange={(e) => setText(e.target.value)} disabled={isUploading}/>
        <span>{200 - textLength}</span>
        <input type="text" placeholder="Trustworthy source..."
          value={source} onChange={(e) => setSource(e.target.value)} disabled={isUploading}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={isUploading}>
          <option value="">Choose category:</option>
          {CATEGORIES.map((cat) => (
            <option value={cat.name} key={cat.name}> {cat.name.toUpperCase()}</option>
          ))}
        </select>
        <button className="btn btn-large" disabled={isUploading}>{isUploading ? 'Posting...' : 'Post'}</button>
      </form>
    );
  }

export default NewFactForm;
