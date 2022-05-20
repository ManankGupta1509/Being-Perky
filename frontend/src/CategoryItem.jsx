import  styled  from 'styled-components';
import React from 'react'
import { mobile } from "../src/responsive";
import {Link} from "react-router-dom";


const Container = styled.div`
  flex: 1;
  margin: 6px;
  min-width: 380px;
  padding: 10px;
  height: 70vh;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${mobile({ height: "40vh" })}
`;

const Info = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
    color: white;
    margin-bottom: 20px;
    opacity: 2;
`;

const Button = styled.button`
    border:none;
    padding: 10px;
    background-color: white;
    color:gray;
    cursor: pointer;
    font-weight: 600;
`;


const CategoryItem = ({item}) => {
  return (
    <Container>
        <Image src={item.img}/>
        <Info>
            <Title>{item.title}</Title>
            <Link to={`/products/${item.key}`}>
            <Button>Shop Now</Button></Link>
        </Info>
    </Container>

  )
}

export default CategoryItem