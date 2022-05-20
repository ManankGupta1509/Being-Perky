import  styled  from 'styled-components';
import React from 'react'
import {categories} from "../../data"
import CategoryItem from '../../CategoryItem';
import { mobile } from "../../responsive";


const Container = styled.div`
 display: flex;
 flex-direction: row;
 flex-wrap: wrap;
  padding: 20px;
  justify-content: space-between;
  ${mobile({ padding: "0px", flexDirection:"column" , marginTop : "15px",})}
`;


const Categories = () => {
  return (
    <Container>
      {categories.map(item=>(
        <CategoryItem item = {item} key={item.id} />
      ))}
    </Container>

  )
}

export default Categories