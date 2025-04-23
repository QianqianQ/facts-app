import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { CATEGORIES } from '../../lib/constants';


function Fact({ fact }) {

    const [votes, setVotes] = useState({
      votesInteresting: fact.votesInteresting || 0 ,
      votesMindblowing: fact.votesMindblowing || 0,
      votesFalse: fact.votesFalse || 0,
    });
    const [isVoting, setIsVoting] = useState(false);
    const isDisputed = votes.votesInteresting + votes.votesMindblowing < votes.votesFalse;
  
    async function handleVote(type) {
      setIsVoting(true);
      const { data: updatedFact, error } = await supabase
        .from('facts')
        .update({ [type]: votes[type] + 1 })
        .eq('id', fact.id)
        .select();
    
      if (!error) setVotes(votes => ({
        ...votes,
        [type]: updatedFact[0][type],
      }));
      else alert('Error voting');
      setIsVoting(false);
    }
  
    return (
      <li className="fact">
        <p>
          {isDisputed ? <span className="disputed">[⛔DISPUTED]</span> : null}
          {fact.text}
          <a className="source"
            href={fact.source}
            target="_blank"
            rel="noreferrer">
              (Source)
          </a>
        </p>
        <span className="tag" style={{backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category).color}}
          >{fact.category}</span
        >
        <div className="vote-buttons">
          <button onClick={() => handleVote('votesInteresting')} disabled={isVoting}>👍 {votes.votesInteresting}</button>
          <button onClick={() => handleVote('votesMindblowing')} disabled={isVoting}>🤯 {votes.votesMindblowing}</button>
          <button onClick={() => handleVote('votesFalse')} disabled={isVoting}>⛔️ {votes.votesFalse}</button>
        </div>
      </li>
   )
}

export default Fact;