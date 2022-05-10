import { IconButton } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Dropdown, DropdownButton, FormControl, InputGroup, Navbar } from 'react-bootstrap'
import { FcShop } from 'react-icons/fc';
import { ThemeMenu } from '../../thememenu/ThemeMenu';
import './header.css';
import { DropdownCustom } from '../../dropdown/DropdownCustom';

const renderNotificationItem = (item, index) => (<></>);

export const Header = () => {
    return (
        <Navbar className='header' bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">
                    <FcShop
                        style={{
                            width: "30",
                            height: "30",
                            margin: "0 15"
                        }}
                        className="d-inline-block align-top"
                    />
                    Shopify
                </Navbar.Brand>
                <InputGroup className="m-auto mx-5 my-2">
                    <DropdownButton
                        variant="secondary"
                        title="Dropdown"
                        id="input-group-dropdown-1"
                    >
                        <Dropdown.Item href="#">Action</Dropdown.Item>
                        <Dropdown.Item href="#">Another action</Dropdown.Item>
                        <Dropdown.Item href="#">Something else here</Dropdown.Item>
                        <Dropdown.Item href="#">Separated link</Dropdown.Item>
                    </DropdownButton>
                    <FormControl aria-label="Text input with dropdown button" />
                </InputGroup>
                <IconButton aria-label="delete" disabled color="primary">
                    {/* <PersonIcon /> */}
                </IconButton>
                <DropdownCustom
                    icon='person'
                    badge='12'
                // contentData={[]}
                // renderItems={(item, index) => renderNotificationItem(item, index)}
                // renderFooter={() => <Link to='/'>View All</Link>}
                />
                <ThemeMenu />
            </Container>
        </Navbar>
    )
}
