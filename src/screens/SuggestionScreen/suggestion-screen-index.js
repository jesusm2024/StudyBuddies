import Header from '../../components/Header/header-index';
import Suggestion from '../../components/Suggestion/suggestion-index';

const SuggestionScreen = (props) => {
    return (
        <div>
            {/* <a href="#container">Reveal</a>
            <div id="container">
                <div id="exampleModal" class="reveal-modal">
                ........
                <a href="#">Close Modal</a>
                </div>
            </div> */}
            <Header userInfo={props.userInfo}/>
            <Suggestion raw_users={props.raw_users} />
        </div>
    )
}

export default SuggestionScreen;