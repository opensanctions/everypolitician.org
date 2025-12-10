'use client';

import Alert from 'react-bootstrap/Alert';
import Badge from "react-bootstrap/Badge";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from 'react-bootstrap/ListGroup';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Pagination from "react-bootstrap/Pagination";
import Row from 'react-bootstrap/Row';
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Tooltip from 'react-bootstrap/Tooltip';


export const NavbarBrand = Navbar.Brand;
export const NavbarToggle = Navbar.Toggle;
export const NavbarCollapse = Navbar.Collapse;
export const NavLink = Nav.Link;
export const NavItem = Nav.Item;
export const ListGroupItem = ListGroup.Item;
export const CardText = Card.Text;
export const CardBody = Card.Body;
export const CardHeader = Card.Header;
export const CardSubtitle = Card.Subtitle;
export const FormGroup = Form.Group;
export const FormControl = Form.Control;
export const FormSelect = Form.Select;
export const FormCheck = Form.Check;
export const FormText = Form.Text;
export const PaginationPrev = Pagination.Prev;
export const PaginationNext = Pagination.Next;
export const PaginationItem = Pagination.Item;
export const AlertHeading = Alert.Heading;
export {
  Alert, Badge, Button,
  ButtonGroup, Card,
  Col,
  Container, Form, InputGroup, ListGroup, Nav, Navbar, Pagination, Row, Spinner, Table,
  // as far as we can tell, OverlayTrigger and Tooltip should be used in a client component
  // otherwise we get `Cannot read properties of undefined (reading 'ref')` errors for
  // pages exceeding a certain number of these or length of tooltip text.
  // https://github.com/opensanctions/operations/issues/1568
  OverlayTrigger, Tooltip
};
