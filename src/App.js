import React from 'react';
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import kendoka from './kendoka.svg';
import './App.css';

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch('https://rickandmortyapi.com/api/character')
    .then((res) => res.json())
    .then((data) => setData(data.results))
    .catch((err) => console.error("Couldn't fetch", err));
  }, [data])

  /* memoizes the callback (will be useful for button to fetch data from ORDS)
  const handleClick = React.useCallback(() => {
    window.open('https://www.telerik.com/kendo-react-ui/components/', '_blank');
  }, []);
  */

  return (
    <div className="App">
      <header className="App-header">
        <img src={kendoka} className="App-logo" alt="kendoka" />
      </header>
      <main>
        { data &&
          <Grid data={data}>
            <GridColumn field='id'></GridColumn>
            <GridColumn field='name'></GridColumn>
            <GridColumn field='status'></GridColumn>
            <GridColumn field='species'></GridColumn>
            <GridColumn field='type'></GridColumn>
            <GridColumn field='origin'></GridColumn>
            <GridColumn field='gender'></GridColumn>
          </Grid>
        }
      </main>
    </div>
  );
}

export default App;
