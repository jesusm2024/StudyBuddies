import Form from '../../components/Form/form-index';

const AccountScreen = (props) => {
    return (
        <div>
            <Form raw_users={props.raw_users}/>
        </div>
    )
}

export default AccountScreen;