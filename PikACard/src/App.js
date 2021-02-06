import React, { Component } from "react";
import "./styles.css";
import ProgressBar from "react-bootstrap/ProgressBar"; // used for loading screen
import { sets } from "./base.json"; //JSON retrieved from API and saved as JSON file.
//This was carried out to reduce loading times of Sets Logos
import "react-toastify/dist/ReactToastify.css";
const bases = sets;

var i = 1;
var apiClass = 13;
var pageSize = 10;
var pageSizeLimit = 0;
var pageEndInt = 0;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiData: [], // API data is stored here
      isFetched: false,
      errorMsg: null,
      searchTerm: "", //hold user input
      progressbarSize: 0, // hold the loading percentage of Progressbar
      apiBase: bases,
      viewDeck: false,
      moreDetails: false,
      cardDetails: [],
      DeckList: [], // holds the cards chosen by user for their deck
      pageStart: 0,
      pageEnd: pageSize,
      CurrentPage: 0,
      pageLimit: 0,
      filterInputsType: "", //holds dropdown filter value for card pokemon's type
      filterInputsWeak: "", //holds dropdown filter value for card pokemon's weakness
      filterInputsSeries: "", //holds dropdown filter value for card series
      filterInputsSupertype: "", //holds dropdown filter value for card supertype
      filterInputsSubtype: "", //holds dropdown filter value for card subtype
      SortBy: "",
      dataSource: []
    };

    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.onSearchFormChange = this.onSearchFormChange.bind(this);
    this.addCardButton = this.addCardButton.bind(this);
    this.removeCardButton = this.removeCardButton.bind(this);
    this.compUpdate = this.compUpdate.bind(this);

    this.filterSortByUpdate = this.filterSortByUpdate.bind(this);
    this.filterUpdateType = this.filterUpdateType.bind(this);
    this.filterUpdateWeak = this.filterUpdateWeak.bind(this);
    this.filterUpdateSeries = this.filterUpdateSeries.bind(this);
    this.filterUpdateSupertype = this.filterUpdateSupertype.bind(this);
    this.filterUpdateSubtype = this.filterUpdateSubtype.bind(this);
    this.emptySearch = this.emptySearch.bind(this);
    this.emptyFilter = this.emptyFilter.bind(this);
    this.moreDetailsClicked = this.moreDetailsClicked.bind(this);
    this.closeDetails = this.closeDetails.bind(this);
  }

  moreDetailsClicked(card) {
    this.setState({ moreDetails: true });
    this.setState({ cardDetails: [card] });
  }

  closeDetails() {
    this.setState({ moreDetails: false });
    this.setState({ cardDetails: [] });
  }

  emptyFilter() {
    pageEndInt = 0;
    this.setState({ pageStart: 0 });
    this.setState({ pageEnd: pageSize });
    // sets all filters back to its original state, resetting all filters
    this.setState({
      filterInputsType: "",
      filterInputsWeak: "",
      filterInputsSeries: "",
      filterInputsSupertype: "",
      filterInputsSubtype: ""
    });
  }

  filterSortByUpdate(event) {
    pageEndInt = 0;
    this.setState({ pageStart: 0 });
    this.setState({ pageEnd: pageSize });
    this.setState({ SortBy: event.target.value });
  }

  filterUpdateType(event) {
    pageEndInt = 0;
    this.setState({ pageStart: 0 });
    this.setState({ pageEnd: pageSize });
    //records the user input for the Type of the Pokemon card from the dropdown
    this.setState({ filterInputsType: event.target.value });
  }

  filterUpdateWeak(event) {
    pageEndInt = 0;
    this.setState({ pageStart: 0 });
    this.setState({ pageEnd: pageSize });
    //records the user input for the Weakness of the Pokemon card from the dropdown
    this.setState({ filterInputsWeak: event.target.value });
  }

  filterUpdateSeries(event) {
    pageEndInt = 0;
    this.setState({ pageStart: 0 });
    this.setState({ pageEnd: pageSize });
    //records the user input for the Card Series of the Pokemon card from the dropdown
    this.setState({ filterInputsSeries: event.target.value });
  }

  filterUpdateSupertype(event) {
    pageEndInt = 0;
    this.setState({ pageStart: 0 });
    this.setState({ pageEnd: pageSize });
    //records the user input for the Card Supertype of the Pokemon card from the dropdown
    this.setState({ filterInputsSupertype: event.target.value });
    this.setState({ filterInputsSubtype: "" });
  }

  filterUpdateSubtype(event) {
    pageEndInt = 0;
    this.setState({ pageStart: 0 });
    this.setState({ pageEnd: pageSize });
    //records the user input for the Card Subtype of the Pokemon card from the dropdown
    this.setState({ filterInputsSubtype: event.target.value });
  }

  emptyDeck() {
    //resets the DeckList to no cards
    this.setState({ DeckList: [] });
  }

  emptySearch() {
    pageEndInt = 0;
    this.setState({ pageStart: 0 });
    this.setState({ pageEnd: pageSize });
    //clears the SearchTerm
    this.setState({ searchTerm: "" });
  }

  nextPage(pageNum) {
    let maths = this.state.pageEnd + pageSize;

    if (maths <= this.state.apiData.length) {
      this.setState({ pageEnd: maths });
      pageEndInt = pageEndInt + pageSize;
      maths = this.state.pageStart + pageSize;
      this.setState({ pageStart: maths });
    }
    // }
  }

  prevPage() {
    let maths = this.state.pageStart - pageSize;
    if (maths > -2) {
      this.setState({ pageStart: maths });
      maths = this.state.pageEnd - pageSize;
      this.setState({ pageEnd: maths });
      pageEndInt = pageEndInt - pageSize;
    }
  }

  addCardButton(card) {
    //extracts a specific card from this.state.apiData and copies it onto the this.state.DeckList
    if (this.state.DeckList.length <= 60)
      //Following game rules, players can only have 60 cards in the deck.
      this.setState({ DeckList: this.state.DeckList.concat(card) });
    else {
      alert(
        "You already have 60 cards in your deck. Please remove a card to add chosen card to deck."
      );
    }
  }

  removeCardButton(card) {
    //allows user to remove a card from their deck (from this.state.DeckList)
    let deckList = this.state.DeckList;
    let count = 0;
    for (var j = 0; j < this.state.DeckList.length; j++) {
      if (deckList[j].id === card.id) {
        count = j;
        break;
      }
    }
    const filteredItems = deckList
      .slice(0, count)
      .concat(deckList.slice(count + 1, deckList.length));
    this.setState({ DeckList: filteredItems });
  }

  onSearchFormChange(event) {
    pageEndInt = 0;
    this.setState({ pageStart: 0 });
    this.setState({ pageEnd: pageSize });
    //keeps track of what the user has typed in the searchbox and keeps track of the string length
    this.setState({ searchTerm: event.target.value });
    let sTerm = event.target.value;
    let numChars = sTerm.length;
    this.setState({ len: numChars });
  }

  compUpdate() {
    pageEndInt = 0;
    this.emptyFilter();
    this.emptySearch();
    if (this.state.viewDeck === true) this.setState({ viewDeck: false });
    else this.setState({ viewDeck: true });
  }

  async componentDidMount() {
    // to fetch API data
    try {
      let jsonResult;
      let ptcg = []; //to store API calls
      for (i = 1; i <= apiClass; i++) {
        const API_URL = `https://api.pokemontcg.io/v1/cards?pageSize=1000&page=${i}`;
        //String interpolation was used to fetch all cards from the API.
        //There were 13 pages of Pokemon cards (1000 cards per page) as of now.
        //Hence why i must be <=13.
        console.log(API_URL);
        const response = await fetch(API_URL);
        this.setState({ progressbarSize: (100 / apiClass) * i });
        jsonResult = await response.json();
        ptcg = jsonResult.cards.concat(ptcg); //concats all API calls
      }
      const finalCards = ptcg;
      this.setState({ apiData: finalCards });
      this.setState({ isFetched: true });
    } catch (error) {
      this.setState({ isFetched: false });
      this.setState({ errorMsg: error });
    }
  }

  render() {
    if (this.state.errorMsg) {
      return (
        // if there is an error in the API call
        <div className="error">
          <img
            src="https://thumbs.gfycat.com/DiligentSelfassuredArthropods-small.gif"
            className="img-fluid img-thumbnail"
            alt="..."
          ></img>
          <h1>An error has occured in the API call</h1>
          <img
            src="https://i.pinimg.com/originals/67/9f/52/679f5279b71238c9003e2799b79a3116.gif"
            className="img-fluid img-thumbnail"
            alt="..."
          ></img>
        </div>
      ); // end of return.
    } else if (this.state.isFetched === false) {
      //LOADING SCREEN
      return (
        <div className="col-12 bg">
          <div className="col px-md-12">
            <div className="p-5"></div>
          </div>
          <div className="col px-md-12">
            <div className="col px-md-3"></div>
            <div className="text-center">
              <img
                src="https://i.gifer.com/1V94.gif"
                className="img-fluid img-thumbnail"
                alt="..."
              ></img>
            </div>
            <div className="text-center">
              <h2>Fetching Data, Please wait...</h2>
            </div>
            <div className="p-2"></div>
          </div>
          <div className="p-1"></div>
          <ProgressBar
            striped
            variant="info"
            now={this.state.progressbarSize}
          />
        </div>
      ); // end of return
    } else if (
      this.state.viewDeck === false &&
      this.state.moreDetails === false
    ) {
      // viewDeck==false means the user is in the Search Page
      return (
        <div className="Searches" class="bg-dark" width="100%">
          <ComponentA // This component contains all query searches
            searchTerm={this.state.searchTerm}
            onChange={this.onSearchFormChange}
            compUpdate={this.compUpdate}
            bases={this.state.apiBase}
            emptySearch={this.emptySearch}
            emptyFilter={this.emptyFilter}
            filterUpdateType={this.filterUpdateType}
            filterUpdateWeak={this.filterUpdateWeak}
            filterUpdateSeries={this.filterUpdateSeries}
            filterUpdateSupertype={this.filterUpdateSupertype}
            filterUpdateSubtype={this.filterUpdateSubtype}
            filterInputsType={this.state.filterInputsType}
            filterInputsWeak={this.state.filterInputsWeak}
            filterInputsSeries={this.state.filterInputsSeries}
            filterInputsSupertype={this.state.filterInputsSupertype}
            filterInputsSubtype={this.state.filterInputsSubtype}
            filterSortByUpdate={this.filterSortByUpdate}
            sortBy={this.state.SortBy}
            autoComplete={this.autoComplete}
            handleSearch={this.handleSearch}
            apiData={this.state.apiData}
            width="100%"
          />

          <ComponentB //Handles all the results from Component A
            className="Searches"
            class="bg-dark"
            width="100%"
            pokemon={this.state.apiData}
            bases={this.state.apiBase}
            searchTerm={this.state.searchTerm}
            addButtonHandler={this.addCardButton}
            pageStart={this.state.pageStart}
            pageEnd={this.state.pageEnd}
            nextPage={this.nextPage}
            prevPage={this.prevPage}
            filterInputsType={this.state.filterInputsType}
            filterInputsWeak={this.state.filterInputsWeak}
            filterInputsSeries={this.state.filterInputsSeries}
            filterInputsSupertype={this.state.filterInputsSupertype}
            filterInputsSubtype={this.state.filterInputsSubtype}
            sortBy={this.state.SortBy}
            moreDetailsClicked={this.moreDetailsClicked}
          />
          <ComponentD //Handles the pages for each result
            pageStart={this.state.pageStart}
            pageEnd={this.state.pageEnd}
            nextPage={this.nextPage}
            prevPage={this.prevPage}
            width="100%"
          />
        </div>
      );
    } else if (
      this.state.viewDeck === true && //DETERMINES IF YOU ARE LOOKING THROUGH THE DECK OR THE SEARCH
      this.state.moreDetails === false
    ) {
      //if ViewDeck===true, this means that the user is in the DeckList
      return (
        // <body>
        <div className="Searches" class="bg-dark" width="100%">
          <ComponentA //Compnonent A allows users to also filter their DeckList
            searchTerm={this.state.searchTerm}
            onChange={this.onSearchFormChange}
            compUpdate={this.compUpdate}
            viewDeck={this.state.viewDeck}
            bases={this.state.apiBase}
            emptySearch={this.emptySearch}
            emptyFilter={this.emptyFilter}
            filterUpdateType={this.filterUpdateType}
            filterUpdateWeak={this.filterUpdateWeak}
            filterUpdateSeries={this.filterUpdateSeries}
            filterUpdateSupertype={this.filterUpdateSupertype}
            filterUpdateSubtype={this.filterUpdateSubtype}
            filterInputsType={this.state.filterInputsType}
            filterInputsWeak={this.state.filterInputsWeak}
            filterInputsSeries={this.state.filterInputsSeries}
            filterInputsSupertype={this.state.filterInputsSupertype}
            filterInputsSubtype={this.state.filterInputsSubtype}
            filterSortByUpdate={this.filterSortByUpdate}
            sortBy={this.state.SortBy}
            autoComplete={this.autoComplete}
            handleSearch={this.handleSearch}
            apiData={this.state.apiData}
            width="100%"
          />

          <ComponentC //Similar to Component B but instead handles the this.state.DeckList instead of this.state.apiData
            deckL={this.state.DeckList}
            bases={this.state.apiBase}
            searchTerm={this.state.searchTerm}
            removeButtonHandler={this.removeCardButton}
            deckCount={this.countHandle}
            filterUpdateType={this.filterUpdateType}
            filterUpdateWeak={this.filterUpdateWeak}
            filterUpdateSeries={this.filterUpdateSeries}
            filterUpdateSupertype={this.filterUpdateSupertype}
            filterUpdateSubtype={this.filterUpdateSubtype}
            filterInputsType={this.state.filterInputsType}
            filterInputsWeak={this.state.filterInputsWeak}
            filterInputsSeries={this.state.filterInputsSeries}
            filterInputsSupertype={this.state.filterInputsSupertype}
            filterInputsSubtype={this.state.filterInputsSubtype}
            sortBy={this.state.SortBy}
            moreDetailsClicked={this.moreDetailsClicked}
            width="100%"
          />

          <div class="col-xs-12 row justify-content-center bg-dark row border border-white">
            <button
              onClick={() => this.emptyDeck()}
              type="button"
              class="btn btn-info padR5"
            >
              Delete Deck
            </button>
          </div>
        </div>
      );
    } else if (this.state.moreDetails === true) {
      return (
        <div className="Searches" class="bg-dark" width="100%">
          <ComponentE // This component renders the FULL details of the card
            cardDetails={this.state.cardDetails}
            closeDetails={this.closeDetails}
            bases={this.state.apiBase}
          />
        </div>
      );
    } // end of return statement// end of the else statement.
  } // end of render()
}

// end of App class
class ComponentA extends Component {
  sortBySeries(seriesA, seriesB) {
    // sorts this.props.filterUpdateSeries alphabetically before rendering in the dropdown list
    let comparison = 0;
    let sA = seriesA.name.toLowerCase();
    let sB = seriesB.name.toLowerCase();

    if (sA > sB) comparison = 1;
    else if (sA < sB) comparison = -1;
    else comparison = 0;

    return comparison;
  }

  render() {
    const searchTermFromProps = this.props.searchTerm; //constants called from parent component
    const onChangeFromProps = this.props.onChange;
    const compUpdate = this.props.compUpdate;
    const viewDeckButton = this.props.viewDeck;
    const bases = this.props.bases;
    const sortBy = this.props.sortBy;
    const emptySearch = this.props.emptySearch;
    const emptyFilter = this.props.emptyFilter;
    const filterUpdateType = this.props.filterUpdateType;
    const filterUpdateWeak = this.props.filterUpdateWeak;
    const filterUpdateSeries = this.props.filterUpdateSeries;
    const filterUpdateSupertype = this.props.filterUpdateSupertype;
    const filterUpdateSubtype = this.props.filterUpdateSubtype;

    const filterInputsType = this.props.filterInputsType;
    const filterInputsWeak = this.props.filterInputsWeak;
    const filterInputsSeries = this.props.filterInputsSeries;
    const filterInputsSupertype = this.props.filterInputsSupertype;
    const filterInputsSubtype = this.props.filterInputsSubtype;
    const filterSortByUpdate = this.props.filterSortByUpdate;
    // const apiData = this.props.apiData;
    // const { dataSource } = this.state;

    return (
      // <body className="bg-dark text-center">
      <div className="ComponentA text-center bg-dark">
        <img //APP LOGO
          alt="person from API"
          src="https://i.gifer.com/YIgR.gif"
          height="100%"
          width="20%"
        />
        <img //APP LOGO
          alt="person from API"
          src="https://cdn.discordapp.com/attachments/765259469507919882/786230463194071050/6d1f725704902a9a46279566975d5acc3a2e477ece5decefb37531baf31a8dd773d36624009d8a94da39a3ee5e6b4b0d3255.png"
          height="100%"
          width="60%"
        />

        <img //APP LOGO
          alt="person from API"
          src="https://i.gifer.com/YIgR.gif"
          height="100%"
          width="20%"
        />
        <div>
          <form>
            <b class="text-white">Type your search here:</b>
          </form>
          <input //For user typed input
            pattern="text"
            value={searchTermFromProps}
            onChange={onChangeFromProps}
            // list={this.state.deckList}
            // dataSource={dataSource}
          />

          <div class="p-1"></div>
          <div class="col-xs-12 row justify-content-center">
            <button // empty search box
              type="button"
              class={"btn btn-danger"}
              height="7%"
              width="7%"
              onClick={emptySearch}
            >
              Clear Search Box
            </button>
          </div>
        </div>
        <div class="p-1"></div>
        <div className="row justify-content-center ">
          <select //TYPE FILTER
            value={filterInputsType}
            onChange={filterUpdateType}
          >
            <option
              value=""
              label="--Pokémon type--"
              class="form-group italic" //sdfsdfsdfs
            ></option>
            <option>Colorless</option>
            <option>Darkness</option>
            <option>Dragon</option>
            <option>Fairy</option>
            <option>Fighting</option>
            <option>Fire</option>
            <option>Grass</option>
            <option>Lightning</option>
            <option>Metal</option>
            <option>Psychic</option>
            <option>Water</option>
          </select>
          <select //TYPE WEAKNESS FILTER
            value={filterInputsWeak}
            onChange={filterUpdateWeak}
          >
            <option
              value=""
              label="--Pokémon type weakness--"
              class="form-group"
            ></option>
            <option>Colorless</option>
            <option>Darkness</option>
            <option>Dragon</option>
            <option>Fairy</option>
            <option>Fighting</option>
            <option>Fire</option>
            <option>Grass</option>
            <option>Lightning</option>
            <option>Metal</option>
            <option>Psychic</option>
            <option>Water</option>
          </select>
          <select //CARD SET FILTER
            value={filterInputsSeries}
            onChange={filterUpdateSeries}
          >
            <option value="" label="--set--" class="form-group"></option>
            {bases.sort(this.sortBySeries).map((b) => (
              <option>{b.name}</option>
            ))}
          </select>
        </div>
        <div class="p-1"></div>
        <div className="row justify-content-center">
          <select //CARD SUPERTYPE FILTER
            value={filterInputsSupertype}
            onChange={filterUpdateSupertype}
          >
            <option
              value=""
              label="--card supertype--"
              class="form-group"
            ></option>
            <option>Pokémon</option>
            <option>Trainer</option>
            <option>Energy</option>
          </select>

          {filterInputsSupertype !== "" && ( //User must have selected a Card Supertype first before rendering the CARD SUBTYPE FILTER
            <select value={filterInputsSubtype} onChange={filterUpdateSubtype}>
              <option
                value=""
                label="--card subtype--"
                class="custom-control-input"
              ></option>
              {filterInputsSupertype === "Pokémon" && ( //if supertype chosen was "Pokemon"
                <optgroup label="Pokémon">
                  <option>Basic</option>
                  <option>Stage 1</option>
                  <option>Stage 2</option>
                  <option>Level Up</option>
                  <option>EX</option>
                  <option>MEGA</option>
                  <option>LEGEND</option>
                  <option>Restored</option>
                  <option>BREAK</option>
                  <option>GX</option>
                  <option>TAG TEAM</option>
                  <option>V</option>
                  <option>VMAX</option>
                </optgroup>
              )}
              {filterInputsSupertype === "Trainer" && ( //if supertype chosen was "Trainer"
                <optgroup label="Trainer">
                  <option>Item</option>
                  <option>Rocket's Secret Machine</option>
                  <option>Stadium</option>
                  <option>Supporter</option>
                  <option>Technical Machine</option>
                  <option>Tool</option>
                </optgroup>
              )}
              {filterInputsSupertype === "Energy" && ( //if supertype chosen was "Energy"
                <optgroup label="Energy">
                  <option>Basic</option>
                  <option>Special</option>
                </optgroup>
              )}
            </select>
          )}

          <select //Allows user to choose how to sort results by
            value={sortBy}
            onChange={filterSortByUpdate}
          >
            <option value="" label="--[sort by]--" class="form-group"></option>
            <option>alphabetical order (ASC)</option>
            <option>alphabetical order (DEC)</option>
            <option>By Card Id (ASC)</option>
            <option>By Card Id (DEC)</option>
            <option>Hitpoints (ASC)</option>
            <option>Hitpoints (DEC)</option>
            <option>Type (ASC)</option>
            <option>Type (DEC)</option>
          </select>
        </div>
        <div class="p-1"></div>
        <div class="col-xs-12 row justify-content-center bg-dark">
          <button //RESET ALL FILTERS
            type="button"
            class="btn btn-danger padR52"
            height="7%"
            width="7%"
            onClick={emptyFilter}
          >
            Clear Filters
          </button>
          <button //Allows user to switch from Card Search to their Deck View
            type="button"
            class={
              viewDeckButton
                ? "btn btn-success padR52"
                : "btn btn-primary padR52"
            }
            onClick={compUpdate}
            height="10%"
            width="10%"
          >
            {viewDeckButton ? "Search all cards" : "View Deck"}
          </button>
        </div>
      </div>
      // </body>
    );
  }
} // close the ComponentA component
//**************************************************//
class ComponentB extends Component {
  cardFilter(searchTerm, type, weak, series, supertype, subtype) {
    //Filters cards by SearchTerm
    return function (card) {
      if (
        (searchTerm !== "" &&
        searchTerm.toLowerCase().length >= 3 && //Only allows render if 3 letters or more are applied in Search box
          !/^\d+$/.test(searchTerm.toLowerCase())) || //Or the first 2 characters are numbers (to find by HP)
        (searchTerm.toLowerCase().length >= 2 &&
          /^\d+$/.test(searchTerm.toLowerCase())) ||
        type !== "" || // If the string is empty but there are Filters applied,
        weak !== "" || //allow the render of the results even if Search Term is empty
        series !== "" ||
        supertype !== "" ||
        subtype !== ""
      ) {
        return (
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.nationalPokedexNumber === searchTerm ||
          (card.types + "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (card.hp + "").toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    };
  }

  filterDropdown(type, weak, series, supertype, subtype) {
    //Filters cards by chosen filters from dropdown lists
    return function (card) {
      let weakness = card.weaknesses && card.weaknesses.map((a1) => a1.type);
      return (
        (card.types + "").includes(type) &&
        (weakness + "").includes(weak) &&
        (card.set + "").includes(series) &&
        (card.supertype + "").includes(supertype) &&
        (card.subtype + "").includes(subtype)
      );
    };
  }

  setFilter(setCode) {
    // filters the setcode comparing from this.state.apiData and base.json
    return function (base) {
      if (base.code === setCode) {
        return base;
      }
    };
  }

  sortBy(sortList, sortingBy) {
    //sorts results by user's choice
    if (sortingBy === "alphabetical order (ASC)") {
      return sortList.sort((a, b) =>
        a.name !== b.name ? (a.name < b.name ? -1 : 1) : 0
      );
    } else if (sortingBy === "alphabetical order (DEC)") {
      return sortList.sort((a, b) =>
        a.name !== b.name ? (b.name < a.name ? -1 : 1) : 0
      );
    } else if (sortingBy === "By Card Id (ASC)") {
      return sortList.sort((a, b) =>
        a.id !== b.id ? (a.id < b.id ? -1 : 1) : 0
      );
    } else if (sortingBy === "By Card Id (DEC)") {
      return sortList.sort((a, b) =>
        a.id !== b.id ? (a.id > b.id ? -1 : 1) : 0
      );
    } else if (sortingBy === "Hitpoints (ASC)") {
      return sortList.sort((a, b) =>
        a.hp !== b.hp ? (parseFloat(a.hp) < parseFloat(b.hp) ? -1 : 1) : 0
      );
    } else if (sortingBy === "Hitpoints (DEC)") {
      return sortList.sort((a, b) =>
        a.hp !== b.hp ? (parseFloat(a.hp) > parseFloat(b.hp) ? -1 : 1) : 0
      );
    } else if (sortingBy === "Type (ASC)") {
      return sortList.sort((a, b) =>
        a.types !== b.types ? (a.types < b.types ? -1 : 1) : 0
      );
    } else if (sortingBy === "Type (DEC)") {
      return sortList.sort((a, b) =>
        a.types !== b.types ? (a.types > b.types ? -1 : 1) : 0
      );
    } else return sortList;
  }

  render() {
    const arrayPass = this.props.pokemon;
    const searchTermFromProps = this.props.searchTerm;
    const addButtonHandler = this.props.addButtonHandler;
    const bases = this.props.bases;

    const filterInputsType = this.props.filterInputsType;
    const filterInputsWeak = this.props.filterInputsWeak;
    const filterInputsSeries = this.props.filterInputsSeries;
    const filterInputsSupertype = this.props.filterInputsSupertype;
    const filterInputsSubtype = this.props.filterInputsSubtype;

    const moreDetailsClicked = this.props.moreDetailsClicked;

    // const notify = () => toast("Wow so easy !");

    const preSplit = arrayPass.filter(
      //FILTERS BY CHOSEN PARAMETERS FROM DROPDOWN LISTS
      this.filterDropdown(
        filterInputsType,
        filterInputsWeak,
        filterInputsSeries,
        filterInputsSupertype,
        filterInputsSubtype
      )
    );

    const splitRes = preSplit.filter(
      //Filters by SearchTerm
      this.cardFilter(
        searchTermFromProps,
        filterInputsType, // passed on to check if filters are applied when searchbox is empty
        filterInputsWeak,
        filterInputsSeries,
        filterInputsSupertype,
        filterInputsSubtype
      )
    );

    const pStart = this.props.pageStart;
    const eStart = this.props.pageEnd;
    const sortedArray = this.sortBy(splitRes, this.props.sortBy);
    const slicedArray = sortedArray.slice(pStart, eStart);
    pageSizeLimit = sortedArray.length;

    return (
      <div className="ComponentB bg-dark">
        <div class="p-2"></div>

        {/*Filter through sliced list. */}
        {slicedArray.map((a) => (
          <div class="row border border-white bg-dark">
            <div class="col-xs-4">
              <div class="col-12">
                <div class="p-2"></div>
                <img
                  alt="person from API"
                  src={a.imageUrl}
                  height="100%"
                  width="80%"
                  class="paddingleft5"
                />
                <div class="p-1"></div>
                <div class="text-center">
                  <button //ALL RESULTS HAVE A BUTTON TO BE ABLE TO ADD CARD TO this.state.DeckList
                    type="button"
                    class="btn btn-primary"
                    onClick={() => addButtonHandler(a)}
                  >
                    Add To Deck
                  </button>
                  <div class="p-1"></div>
                </div>
              </div>
            </div>
            <div class="col-8">
              <div class="p-2"></div>
              <div class="col-8 float-left">
                <h3 class="text-white"> {a.name} </h3>
                <div class="p-0"></div>
                <p class="text-white">
                  <b>Card Id:</b> {a.id}{" "}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  <b>National Pokedex Number:</b> {a.nationalPokedexNumber}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  <b>Types:</b>{" "}
                  {a.types &&
                    a.types // to extract types of card
                      .map((a1) => <i>{a1} </i>)}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  <b>Hitpoints:</b> {a.hp}{" "}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  <b>Card Type:</b> {a.supertype}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  <b>Rarity:</b> {a.rarity}
                </p>
                <div class="p-0"></div>
                <div class="p-2"></div>
                <button //Brings user to a high resolution image of the chosen card
                  type="button"
                  class="btn btn-primary"
                  onClick={() => moreDetailsClicked(a)}
                  height="10%"
                  width="10%"
                >
                  More Details
                </button>
              </div>
              <div class="col-xs-3 text-center">
                <a href={a.imageUrlHiRes}>
                  <div>
                    <button //Brings user to a high resolution image of the chosen card
                      type="button"
                      class="btn btn-primary"
                      height="8%"
                      width="8%"
                    >
                      High Resultion Image
                    </button>
                    {true ? "" : ""}
                  </div>
                </a>
                <div class="p-1"></div>
                <div class="p-3"></div>
                {bases.filter(this.setFilter(a.setCode)).map((
                  b
                  //this map is used to render the correct set Image
                  //as each card comes from a specific set
                ) => (
                  <img
                    alt="person from API"
                    src={b.logoUrl}
                    height="25%"
                    width="25%"
                    div
                  />
                ))}
              </div>
            </div>
            <div class="p-0"></div>
          </div>
        ))}
      </div>
    );
  }
} // close the ComponentB component

class ComponentC extends Component {
  cardFilter(searchTerm, type, weak, series, supertype, subtype) {
    //Filters cards by SearchTerm
    return function (card) {
      return (
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) || //Renders even if searchTerm is empty.
        card.nationalPokedexNumber === searchTerm || //This is allowed as this.state.DeckList will only have max of 60 cards
        (card.types + "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.hp + "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        type !== "" ||
        weak !== "" ||
        series !== "" ||
        supertype !== "" ||
        subtype !== ""
      );
    };
  }

  setFilter(setCode) {
    //Filters through the cards
    return function (base) {
      if (base.code === setCode) {
        return base;
      }
    };
  }

  filterDropdown(type, weak, series, supertype, subtype) {
    //Filters cards by chosen filters from dropdown lists
    return function (card) {
      let weakness = card.weaknesses && card.weaknesses.map((a1) => a1.type);
      return (
        (card.types + "").includes(type) &&
        (weakness + "").includes(weak) &&
        (card.set + "").includes(series) &&
        (card.supertype + "").includes(supertype) &&
        (card.subtype + "").includes(subtype)
      );
    };
  }

  sortBy(sortList, sortingBy) {
    //sorts results by user's choice
    if (sortingBy === "alphabetical order (ASC)") {
      return sortList.sort((a, b) =>
        a.name !== b.name ? (a.name < b.name ? -1 : 1) : 0
      );
    } else if (sortingBy === "alphabetical order (DEC)") {
      return sortList.sort((a, b) =>
        a.name !== b.name ? (b.name < a.name ? -1 : 1) : 0
      );
    } else if (sortingBy === "By Card Id (ASC)") {
      return sortList.sort((a, b) =>
        a.id !== b.id ? (a.id < b.id ? -1 : 1) : 0
      );
    } else if (sortingBy === "By Card Id (DEC)") {
      return sortList.sort((a, b) =>
        a.id !== b.id ? (a.id > b.id ? -1 : 1) : 0
      );
    } else if (sortingBy === "Hitpoints (ASC)") {
      return sortList.sort((a, b) =>
        a.hp !== b.hp ? (parseFloat(a.hp) < parseFloat(b.hp) ? -1 : 1) : 0
      );
    } else if (sortingBy === "Hitpoints (DEC)") {
      return sortList.sort((a, b) =>
        a.hp !== b.hp ? (parseFloat(a.hp) > parseFloat(b.hp) ? -1 : 1) : 0
      );
    } else if (sortingBy === "Type (ASC)") {
      return sortList.sort((a, b) =>
        a.types !== b.types ? (a.types < b.types ? -1 : 1) : 0
      );
    } else if (sortingBy === "Type (DEC)") {
      return sortList.sort((a, b) =>
        a.types !== b.types ? (a.types > b.types ? -1 : 1) : 0
      );
    } else return sortList;
  }

  isDeckEmpty(deck) {
    return deck.length === 0;
  }

  propmtOne(list, string) {
    for (var c = 0; c < list.length; c++)
      if (list[c].supertype === string) return true;
    return false;
  }

  stageCheck(array) {
    //Return a boolean value to determine if a Pokemon card in the deck does not have
    //a complementary pre-evolution pokemon. i.e. user has Charmeleon but no Charmander
    var pokemonName = array.map((a) => a.name);
    for (var k = 0; k < array.length; k++)
      if (array[k].evolvesFrom !== undefined)
        if (!pokemonName.includes(array[k].evolvesFrom)) return false;
    return true;
  }

  render() {
    //Sets all the constants
    const deckPass = this.props.deckL;
    const searchTermFromProps = this.props.searchTerm;
    const removeButtonHandler = this.props.removeButtonHandler;
    const bases = this.props.bases;
    const sortBy = this.sortBy(deckPass, this.props.sortBy);
    const filterInputsType = this.props.filterInputsType;
    const filterInputsWeak = this.props.filterInputsWeak;
    const filterInputsSeries = this.props.filterInputsSeries;
    const filterInputsSupertype = this.props.filterInputsSupertype;
    const filterInputsSubtype = this.props.filterInputsSubtype;
    const moreDetailsClicked = this.props.moreDetailsClicked;

    return (
      <div className="ComponentC">
        <div class="p-2"></div>
        <b>
          {deckPass.length === 0 && ( //Prompt if user does not have any cards in the deck
            <div class="text-center text-white bg-danger border border-white">
              <h1>No cards in deck</h1>
            </div>
          )}

          {deckPass.length !== 0 &&
          this.propmtOne(deckPass, "Trainer") === false && ( //Prompt if user has no Trainer cards in the deck
              <div class="text-center text-white bg-warning border border-white">
                <h1>No Trainer cards in deck</h1>
              </div>
            )}

          {deckPass.length !== 0 &&
          this.propmtOne(deckPass, "Pokémon") === false && ( //Prompt if user has no Pokemon cards in the deck
              <div class="text-center text-white bg-danger border border-white">
                <h1>No Pokémon cards in deck</h1>
              </div>
            )}

          {deckPass.length !== 0 &&
          this.propmtOne(deckPass, "Energy") === false && ( //Prompt if user has no Energy cards in the deck
              <div class="text-center text-white bg-warning border border-white">
                <h1>No Energy cards in deck</h1>
              </div>
            )}
          {deckPass.length !== 0 &&
          this.stageCheck(deckPass) === false && ( //Prompt if user has no pre-evolved form of a Stage1/2 Pokemon in their deck
              //in the deck
              <div class="text-center text-white bg-danger border border-white">
                <h1>Missing pre-evolution of some Pokémon Cards in deck</h1>
              </div>
            )}
        </b>

        {sortBy
          .filter(
            this.cardFilter(
              searchTermFromProps,
              filterInputsType,
              filterInputsWeak,
              filterInputsSeries,
              filterInputsSupertype,
              filterInputsSubtype
            )
          )
          .filter(
            this.filterDropdown(
              filterInputsType,
              filterInputsWeak,
              filterInputsSeries,
              filterInputsSupertype,
              filterInputsSubtype
            )
          )
          .map((a) => (
            <div class="row border border-white bg-secondary ">
              <div class="col-xs-4">
                <div class="col-12">
                  <div class="p-2"></div>
                  <img
                    alt="person from API"
                    src={a.imageUrl}
                    height="100%"
                    width="80%"
                    class="paddingleft5"
                  />
                  <div class="p-1"></div>
                  <div class="text-center">
                    <button
                      type="button"
                      class="btn btn-primary"
                      //ALL RESULTS HAVE A BUTTON TO BE ABLE TO REMOVE CARD FROM this.state.DeckList
                      onClick={() => removeButtonHandler(a)}
                    >
                      Remove
                    </button>
                    <div class="p-1"></div>
                  </div>
                </div>
              </div>
              {/* <!-- buttons and pokemon name --> */}
              <div class="col-8">
                <div class="p-2"></div>
                <div class="col-8 float-left">
                  <h3 class="text-white"> {a.name} </h3>
                  <div class="p-0"></div>
                  <p class="text-white">
                    <b>Card Id:</b> {a.id}{" "}
                  </p>
                  <div class="p-0"></div>
                  <p class="text-white">
                    <b>National Pokedex Number:</b> {a.nationalPokedexNumber}
                  </p>
                  <div class="p-0"></div>
                  <p class="text-white">
                    <b>Types:</b>{" "}
                    {a.types &&
                      a.types.map((a1) => (
                        <i>
                          {
                            a1 // to extract types of card
                          }{" "}
                        </i>
                      ))}
                  </p>
                  <div class="p-0"></div>
                  <p class="text-white">
                    <b>Hitpoints:</b> {a.hp}{" "}
                  </p>
                  <div class="p-0"></div>
                  <p class="text-white">
                    <b>Card Type:</b> {a.supertype}
                  </p>
                  <div class="p-0"></div>
                  <p class="text-white">
                    <b>Rarity:</b> {a.rarity} {a.count}
                  </p>
                  <div class="p-0"></div>
                  <div class="p-2"></div>
                  <button //Brings user to a high resolution image of the chosen card
                    type="button"
                    class="btn btn-primary"
                    onClick={() => moreDetailsClicked(a)}
                    height="10%"
                    width="10%"
                  >
                    More Details
                  </button>
                </div>
                {/* border border-warning */}
                <div class="col-xs-3 text-center">
                  <a href={a.imageUrlHiRes}>
                    <div>
                      <button //Brings user to a high resolution image of the chosen card
                        type="button"
                        class="btn btn-primary"
                        height="25%"
                        width="25%"
                      >
                        High Resultion Image
                      </button>
                    </div>
                  </a>
                  <div class="p-1"></div>
                  <div class="p-3"></div>

                  {bases.filter(this.setFilter(a.setCode)).map((
                    b
                    //this map is used to render the correct set Image
                    //as each card comes from a specific set
                  ) => (
                    <img
                      alt="person from API"
                      src={b.logoUrl}
                      height="25%"
                      width="25%"
                      div
                    />
                  ))}
                </div>
              </div>
              <div class="p-0"></div>
            </div>
          ))}
      </div>
    );
  }
}

class ComponentD extends Component {
  render() {
    const nextPage = this.props.nextPage;
    const prevPage = this.props.prevPage;

    return (
      <div class="col-xs-12 row justify-content-center bg-dark row border border-white">
        {/* handles the next button, and if the page hit max it changes render button to red. previous odes the opposite*/}
        <button
          onClick={() => prevPage()}
          type="button"
          class={
            0 > pageEndInt - 1 ? "btn btn-danger padL5" : "btn btn-info padL5"
          }
          disabled={0 > pageEndInt - 1}
        >
          Previous Page
        </button>

        <button
          type="button"
          class={
            pageSizeLimit < pageEndInt + pageSize + 1
              ? "btn btn-danger padL5"
              : "btn btn-info padL5"
          }
          onClick={() => nextPage()}
          disabled={pageSizeLimit < pageEndInt + pageSize + 1}
        >
          Next Page
        </button>
      </div>
    );
  }
}

class ComponentE extends Component {
  //Component E takes in one card and provides more details about the card unlinke Component B or C
  setFilter(setCode) {
    return function (base) {
      if (base.code === setCode) {
        return base;
      }
    };
  }
  render() {
    const cDetails = this.props.cardDetails;
    const bases = this.props.bases;
    const closeDetails = this.props.closeDetails;

    return (
      <div className="ComponentB bg-dark">
        <img //APP LOGO
          alt="person from API"
          src="https://i.gifer.com/YIgR.gif"
          height="100%"
          width="20%"
        />
        <img //APP LOGO
          alt="person from API"
          src="https://cdn.discordapp.com/attachments/765259469507919882/786230463194071050/6d1f725704902a9a46279566975d5acc3a2e477ece5decefb37531baf31a8dd773d36624009d8a94da39a3ee5e6b4b0d3255.png"
          height="100%"
          width="60%"
        />

        <img //APP LOGO
          alt="person from API"
          src="https://i.gifer.com/YIgR.gif"
          height="100%"
          width="20%"
        />
        <button //Brings user to a high resolution image of the chosen card
          type="button"
          class="btn btn-primary"
          onClick={closeDetails}
          height="8%"
          width="8%"
        >
          Back
        </button>
        <div class="p-2"></div>
        {cDetails.map((a) => (
          <div class="row border border-white bg-dark">
            <div class="col-xs-4">
              <div class="col-12">
                <div class="p-2"></div>
                <img
                  alt="person from API"
                  src={a.imageUrl}
                  height="100%"
                  width="80%"
                  class="paddingleft5"
                />
                <div class="p-1"></div>
                <div class="text-center">
                  <div class="p-1"></div>
                </div>
              </div>
            </div>
            <div class="col-8">
              <div class="p-2"></div>
              <div class="col-8 float-left">
                <h3 class="text-white"> {a.name} </h3>
                <div class="p-0"></div>
                <p class="text-white">
                  {" "}
                  <b>Card Id:</b> {a.id}{" "}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  <b>National Pokedex Number:</b> {a.nationalPokedexNumber}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  <b>Types:</b>{" "}
                  {a.types &&
                    a.types // to extract types of card
                      .map((a1) => <i>{a1} </i>)}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  <b>Weaknesses:</b>{" "}
                  {a.weaknesses &&
                    a.weaknesses // to extract weakness types of card
                      .map((a1) => (
                        <i>
                          {a1.type}
                          {a1.value}{" "}
                        </i>
                      ))}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  {" "}
                  <b>Card Supertype:</b> {a.supertype}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  {" "}
                  <b>Card Subtype:</b> {a.subtype}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  {" "}
                  <b>Evolves From:</b> {a.evolvesFrom}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  {" "}
                  <b>Hitpoints:</b> {a.hp}
                </p>

                <div class="p-0"></div>
                <p class="text-white">
                  <b>Retreat Cost:</b>{" "}
                  {a.retreatCost &&
                    a.retreatCost // to extract types of card
                      .map((a1, index) => (
                        <p2 key={index}>
                          {" "}
                          <i>{a1} </i>
                        </p2>
                      ))}
                </p>
                <p class="text-white">
                  <b>Rarity:</b> {a.rarity}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  <b>Series:</b> {a.series}{" "}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  <b>Set:</b> {a.set}{" "}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  {" "}
                  <b>Card Artist:</b> {a.artist}
                </p>
                <div class="p-0"></div>
                <p class="text-white">
                  {a.attacks && //display details of each Pokemon Attacks
                    a.attacks.map((s1, i1) => (
                      <p key={i1}>
                        <br />
                        <b>Attack Name({i1 + 1}):</b> {s1.name}
                        <br />
                        <b>Damage:</b> {s1.damage}
                        <br />
                        <b>Attack Details:</b> {s1.text}
                        <br />
                        <b>Cost: </b>
                        <i>
                          {s1.cost.map((s2, i2) => (
                            <i>{s2}&nbsp;</i>
                          ))}
                        </i>
                        <i></i>
                        <br />
                        <b>Converted Energy Cost:</b> {s1.convertedEnergyCost}
                      </p>
                    ))}
                </p>
                <div class="p-0"></div>
                <div class="p-2"></div>
              </div>
              <div class="col-xs-3 text-center">
                <a href={a.imageUrlHiRes}>
                  <div>
                    <button //Brings user to a high resolution image of the chosen card
                      type="button"
                      class="btn btn-primary"
                      height="8%"
                      width="8%"
                    >
                      High Resultion Image
                    </button>
                  </div>
                </a>
                <div class="p-1"></div>
                <div class="p-3"></div>
                {bases.filter(this.setFilter(a.setCode)).map((
                  b
                  //this map is used to render the correct set Image
                  //as each card comes from a specific set
                ) => (
                  <img
                    alt="person from API"
                    src={b.logoUrl}
                    height="25%"
                    width="25%"
                    div
                  />
                ))}
              </div>
            </div>
            <div class="p-0"></div>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
