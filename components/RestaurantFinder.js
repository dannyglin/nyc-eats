import React, { useState, useEffect } from 'react';
import { Center, Glass, Emphasis, View } from './styles';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 15px;
    margin: 15px 0;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const FilterLabel = styled.label`
  background: linear-gradient(to right, #faaca8, #ddd6f3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 14px;
  font-weight: 600;
`;

const FilterSelect = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #eebdc7;
  padding: 8px 12px;
  font-family: 'aqua';
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  
  &:focus {
    outline: none;
    border-color: #eebdc7;
    color: #ddd6f3;
  }
  
  option {
    background: #2a2a3e;
    color: #eebdc7;
    font-weight: 600;
  }
`;

const RandomButton = styled.button`
  background: linear-gradient(to right, #faaca8, #ddd6f3);
  border: none;
  border-radius: 12px;
  color: white;
  padding: 15px 30px;
  font-family: 'aqua';
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  margin: 20px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  pointer-events: all;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(250, 172, 168, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const RestaurantCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  padding: 25px;
  margin: 20px auto;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  
  h2 {
    color: #ddd6f3;
    margin: 0 0 10px 0;
    font-size: 24px;
  }
  
  p {
    color: #e1d0e9;
    margin: 8px 0;
    font-size: 16px;
  }
  
  .cuisine {
    color: #eebdc7;
    font-weight: 600;
  }
  
  .price {
    color: #faaca8;
    font-size: 20px;
    font-weight: 600;
  }
  
  .borough {
    color: #b5b5c8;
    font-style: italic;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    margin: 15px auto;
    width: 95%;
    
    h2 {
      font-size: 20px;
    }
    
    p {
      font-size: 14px;
    }
    
    .price {
      font-size: 18px;
    }
  }
`;

// Comprehensive NYC restaurant data
const restaurants = [
  // Manhattan - Italian
  { name: "Joe's Pizza", cuisine: "Italian", borough: "Manhattan", price: "$", address: "7 Carmine St" },
  { name: "Lombardi's", cuisine: "Italian", borough: "Manhattan", price: "$$", address: "32 Spring St" },
  { name: "Prince Street Pizza", cuisine: "Italian", borough: "Manhattan", price: "$", address: "27 Prince St" },
  { name: "Artichoke Basille's Pizza", cuisine: "Italian", borough: "Manhattan", price: "$$", address: "328 E 14th St" },
  { name: "Carmine's", cuisine: "Italian", borough: "Manhattan", price: "$$$", address: "200 W 44th St" },
  { name: "Ferrara Bakery & Cafe", cuisine: "Italian", borough: "Manhattan", price: "$$", address: "195 Grand St" },
  { name: "Don Angie", cuisine: "Italian", borough: "Manhattan", price: "$$$", address: "103 Greenwich Ave" },
  { name: "Via Carota", cuisine: "Italian", borough: "Manhattan", price: "$$$", address: "51 Grove St" },
  { name: "L'Artusi", cuisine: "Italian", borough: "Manhattan", price: "$$$$", address: "228 W 10th St" },
  { name: "Rezdôra", cuisine: "Italian", borough: "Manhattan", price: "$$$$", address: "27 E 20th St" },
  
  // Manhattan - Chinese
  { name: "Xi'an Famous Foods", cuisine: "Chinese", borough: "Manhattan", price: "$$", address: "81 St Marks Pl" },
  { name: "Joe's Shanghai", cuisine: "Chinese", borough: "Manhattan", price: "$$", address: "9 Pell St" },
  { name: "Nom Wah Tea Parlor", cuisine: "Chinese", borough: "Manhattan", price: "$$", address: "13 Doyers St" },
  { name: "Vanessa's Dumpling House", cuisine: "Chinese", borough: "Manhattan", price: "$", address: "118 Eldridge St" },
  { name: "Prosperity Dumpling", cuisine: "Chinese", borough: "Manhattan", price: "$", address: "46 Eldridge St" },
  { name: "Wo Hop", cuisine: "Chinese", borough: "Manhattan", price: "$", address: "17 Mott St" },
  { name: "Peking Duck House", cuisine: "Chinese", borough: "Manhattan", price: "$$$", address: "28 Mott St" },
  { name: "Hakkasan", cuisine: "Chinese", borough: "Manhattan", price: "$$$$", address: "311 W 43rd St" },
  { name: "RedFarm", cuisine: "Chinese", borough: "Manhattan", price: "$$$", address: "529 Hudson St" },
  { name: "Hutong", cuisine: "Chinese", borough: "Manhattan", price: "$$$$", address: "731 Lexington Ave" },
  
  // Manhattan - Japanese
  { name: "Ippudo", cuisine: "Japanese", borough: "Manhattan", price: "$$", address: "65 4th Ave" },
  { name: "Totto Ramen", cuisine: "Japanese", borough: "Manhattan", price: "$$", address: "366 W 52nd St" },
  { name: "Nobu", cuisine: "Japanese", borough: "Manhattan", price: "$$$$", address: "195 Broadway" },
  { name: "Sushi Yasuda", cuisine: "Japanese", borough: "Manhattan", price: "$$$$", address: "204 E 43rd St" },
  { name: "Ichiran", cuisine: "Japanese", borough: "Manhattan", price: "$$", address: "374 Johnson Ave" },
  { name: "Blue Ribbon Sushi", cuisine: "Japanese", borough: "Manhattan", price: "$$$", address: "119 Sullivan St" },
  { name: "Katsu-Hama", cuisine: "Japanese", borough: "Manhattan", price: "$$", address: "11 E 47th St" },
  { name: "Raku", cuisine: "Japanese", borough: "Manhattan", price: "$$", address: "342 E 6th St" },
  { name: "Takahachi", cuisine: "Japanese", borough: "Manhattan", price: "$$", address: "85 Ave A" },
  { name: "Masa", cuisine: "Japanese", borough: "Manhattan", price: "$$$$", address: "10 Columbus Cir" },
  
  // Manhattan - French
  { name: "Le Bernardin", cuisine: "French", borough: "Manhattan", price: "$$$$", address: "155 W 51st St" },
  { name: "Balthazar", cuisine: "French", borough: "Manhattan", price: "$$$", address: "80 Spring St" },
  { name: "Daniel", cuisine: "French", borough: "Manhattan", price: "$$$$", address: "60 E 65th St" },
  { name: "Jean-Georges", cuisine: "French", borough: "Manhattan", price: "$$$$", address: "1 Central Park W" },
  { name: "Le Coucou", cuisine: "French", borough: "Manhattan", price: "$$$$", address: "138 Lafayette St" },
  { name: "Pastis", cuisine: "French", borough: "Manhattan", price: "$$$", address: "52 Gansevoort St" },
  { name: "Buvette", cuisine: "French", borough: "Manhattan", price: "$$", address: "42 Grove St" },
  { name: "Cafe Sabarsky", cuisine: "French", borough: "Manhattan", price: "$$$", address: "1048 5th Ave" },
  
  // Manhattan - American
  { name: "Shake Shack", cuisine: "American", borough: "Manhattan", price: "$$", address: "Madison Square Park" },
  { name: "Eleven Madison Park", cuisine: "American", borough: "Manhattan", price: "$$$$", address: "11 Madison Ave" },
  { name: "Serendipity 3", cuisine: "American", borough: "Manhattan", price: "$$$", address: "225 E 60th St" },
  { name: "Clinton St. Baking Company", cuisine: "American", borough: "Manhattan", price: "$$", address: "4 Clinton St" },
  { name: "Dimes", cuisine: "American", borough: "Manhattan", price: "$$", address: "85 Willett St" },
  { name: "The Smith", cuisine: "American", borough: "Manhattan", price: "$$", address: "956 2nd Ave" },
  { name: "Union Square Cafe", cuisine: "American", borough: "Manhattan", price: "$$$", address: "101 E 19th St" },
  { name: "Gramercy Tavern", cuisine: "American", borough: "Manhattan", price: "$$$$", address: "42 E 20th St" },
  { name: "Blue Hill", cuisine: "American", borough: "Manhattan", price: "$$$$", address: "75 Washington Pl" },
  { name: "The Modern", cuisine: "American", borough: "Manhattan", price: "$$$$", address: "9 W 53rd St" },
  
  // Manhattan - Steakhouse
  { name: "Keens Steakhouse", cuisine: "Steakhouse", borough: "Manhattan", price: "$$$$", address: "72 W 36th St" },
  { name: "The Palm", cuisine: "Steakhouse", borough: "Manhattan", price: "$$$$", address: "837 2nd Ave" },
  { name: "Wolfgang's Steakhouse", cuisine: "Steakhouse", borough: "Manhattan", price: "$$$$", address: "4 Park Ave" },
  { name: "Smith & Wollensky", cuisine: "Steakhouse", borough: "Manhattan", price: "$$$$", address: "797 3rd Ave" },
  { name: "Gallaghers Steakhouse", cuisine: "Steakhouse", borough: "Manhattan", price: "$$$$", address: "228 W 52nd St" },
  
  // Manhattan - Jewish Deli
  { name: "Katz's Delicatessen", cuisine: "Jewish Deli", borough: "Manhattan", price: "$$", address: "205 E Houston St" },
  { name: "Russ & Daughters", cuisine: "Jewish Deli", borough: "Manhattan", price: "$$$", address: "179 E Houston St" },
  { name: "Russ & Daughters Cafe", cuisine: "Jewish Deli", borough: "Manhattan", price: "$$$", address: "127 Orchard St" },
  { name: "Zabar's", cuisine: "Jewish Deli", borough: "Manhattan", price: "$$", address: "2245 Broadway" },
  { name: "Barney Greengrass", cuisine: "Jewish Deli", borough: "Manhattan", price: "$$", address: "541 Amsterdam Ave" },
  { name: "H&H Bagels", cuisine: "Jewish Deli", borough: "Manhattan", price: "$", address: "2239 Broadway" },
  
  // Manhattan - Middle Eastern
  { name: "Halal Guys", cuisine: "Middle Eastern", borough: "Manhattan", price: "$", address: "307 E 14th St" },
  { name: "Mamoun's Falafel", cuisine: "Middle Eastern", borough: "Manhattan", price: "$", address: "119 MacDougal St" },
  { name: "Taim", cuisine: "Middle Eastern", borough: "Manhattan", price: "$", address: "222 Waverly Pl" },
  { name: "Naya", cuisine: "Middle Eastern", borough: "Manhattan", price: "$$", address: "688 10th Ave" },
  
  // Manhattan - Mexican
  { name: "Los Tacos No. 1", cuisine: "Mexican", borough: "Manhattan", price: "$", address: "Chelsea Market" },
  { name: "Cosme", cuisine: "Mexican", borough: "Manhattan", price: "$$$$", address: "35 E 21st St" },
  { name: "Pujol", cuisine: "Mexican", borough: "Manhattan", price: "$$$$", address: "31 Hudson Yards" },
  { name: "Casa Enrique", cuisine: "Mexican", borough: "Queens", price: "$$$", address: "5-48 49th Ave" },
  
  // Manhattan - Soul Food
  { name: "Sylvia's", cuisine: "Soul Food", borough: "Manhattan", price: "$$", address: "328 Malcolm X Blvd" },
  { name: "Amy Ruth's", cuisine: "Soul Food", borough: "Manhattan", price: "$$", address: "113 W 116th St" },
  { name: "Red Rooster", cuisine: "Soul Food", borough: "Manhattan", price: "$$$", address: "310 Malcolm X Blvd" },
  
  // Manhattan - Other
  { name: "Momofuku Noodle Bar", cuisine: "Asian Fusion", borough: "Manhattan", price: "$$$", address: "171 1st Ave" },
  { name: "The Spotted Pig", cuisine: "British", borough: "Manhattan", price: "$$$", address: "314 W 11th St" },
  { name: "Veselka", cuisine: "Ukrainian", borough: "Manhattan", price: "$$", address: "144 2nd Ave" },
  { name: "Cafe Mogador", cuisine: "Moroccan", borough: "Manhattan", price: "$$", address: "101 St Marks Pl" },
  { name: "Chinatown Ice Cream Factory", cuisine: "Dessert", borough: "Manhattan", price: "$", address: "65 Bayard St" },
  { name: "Levain Bakery", cuisine: "Bakery", borough: "Manhattan", price: "$", address: "167 W 74th St" },
  { name: "Eileen's Special Cheesecake", cuisine: "Dessert", borough: "Manhattan", price: "$", address: "17 Cleveland Pl" },
  
  // Brooklyn
  { name: "Peter Luger", cuisine: "Steakhouse", borough: "Brooklyn", price: "$$$$", address: "178 Broadway" },
  { name: "Lucali", cuisine: "Italian", borough: "Brooklyn", price: "$$$", address: "575 Henry St" },
  { name: "Roberta's", cuisine: "Italian", borough: "Brooklyn", price: "$$$", address: "261 Moore St" },
  { name: "Junior's", cuisine: "American", borough: "Brooklyn", price: "$$", address: "386 Flatbush Ave" },
  { name: "Grimaldi's", cuisine: "Italian", borough: "Brooklyn", price: "$$", address: "1 Front St" },
  { name: "Smorgasburg", cuisine: "Food Market", borough: "Brooklyn", price: "$$", address: "East River State Park" },
  { name: "Coney Island Nathan's", cuisine: "American", borough: "Brooklyn", price: "$", address: "1310 Surf Ave" },
  { name: "L&B Spumoni Gardens", cuisine: "Italian", borough: "Brooklyn", price: "$$", address: "2725 86th St" },
  { name: "Fette Sau", cuisine: "BBQ", borough: "Brooklyn", price: "$$$", address: "354 Metropolitan Ave" },
  { name: "Di Fara", cuisine: "Italian", borough: "Brooklyn", price: "$$$", address: "1424 Ave J" },
  { name: "Totonno's", cuisine: "Italian", borough: "Brooklyn", price: "$$", address: "1524 Neptune Ave" },
  { name: "Frankies 457 Spuntino", cuisine: "Italian", borough: "Brooklyn", price: "$$$", address: "457 Court St" },
  { name: "Al di La", cuisine: "Italian", borough: "Brooklyn", price: "$$$", address: "248 5th Ave" },
  { name: "Olmsted", cuisine: "American", borough: "Brooklyn", price: "$$$", address: "659 Vanderbilt Ave" },
  { name: "Lilia", cuisine: "Italian", borough: "Brooklyn", price: "$$$$", address: "567 Union Ave" },
  { name: "Cecconi's", cuisine: "Italian", borough: "Brooklyn", price: "$$$", address: "1 Main St" },
  { name: "The River Cafe", cuisine: "American", borough: "Brooklyn", price: "$$$$", address: "1 Water St" },
  { name: "Hometown Bar-B-Que", cuisine: "BBQ", borough: "Brooklyn", price: "$$", address: "454 Van Brunt St" },
  { name: "Dinosaur Bar-B-Que", cuisine: "BBQ", borough: "Brooklyn", price: "$$", address: "604 Union St" },
  { name: "Brennan & Carr", cuisine: "American", borough: "Brooklyn", price: "$", address: "3432 Nostrand Ave" },
  
  // Queens
  { name: "Taverna Kyclades", cuisine: "Greek", borough: "Queens", price: "$$$", address: "33-07 Ditmars Blvd" },
  { name: "Flushing Night Market", cuisine: "Asian Fusion", borough: "Queens", price: "$$", address: "Flushing Meadows Corona Park" },
  { name: "Mu Ramen", cuisine: "Japanese", borough: "Queens", price: "$$", address: "1209 Jackson Ave" },
  { name: "M. Wells Steakhouse", cuisine: "Steakhouse", borough: "Queens", price: "$$$$", address: "43-15 Crescent St" },
  { name: "Sripraphai", cuisine: "Thai", borough: "Queens", price: "$$", address: "64-13 39th Ave" },
  { name: "Joe's Shanghai", cuisine: "Chinese", borough: "Queens", price: "$$", address: "136-21 37th Ave" },
  { name: "Spicy & Tasty", cuisine: "Chinese", borough: "Queens", price: "$$", address: "39-07 Prince St" },
  { name: "Nan Xiang Xiao Long Bao", cuisine: "Chinese", borough: "Queens", price: "$$", address: "38-12 Prince St" },
  { name: "White Bear", cuisine: "Chinese", borough: "Queens", price: "$", address: "135-02 Roosevelt Ave" },
  { name: "Arepa Lady", cuisine: "Colombian", borough: "Queens", price: "$", address: "77-17 37th Ave" },
  { name: "Tortilleria Nixtamal", cuisine: "Mexican", borough: "Queens", price: "$", address: "104-05 47th Ave" },
  { name: "Kabab King", cuisine: "Pakistani", borough: "Queens", price: "$", address: "73-20 Broadway" },
  { name: "Himalayan Yak", cuisine: "Nepalese", borough: "Queens", price: "$$", address: "72-20 Roosevelt Ave" },
  { name: "Ayada Thai", cuisine: "Thai", borough: "Queens", price: "$$", address: "77-08 Woodside Ave" },
  { name: "Phayul", cuisine: "Tibetan", borough: "Queens", price: "$$", address: "74-06 37th Ave" },
  
  // Bronx
  { name: "Arthur Avenue Retail Market", cuisine: "Italian", borough: "Bronx", price: "$$", address: "2344 Arthur Ave" },
  { name: "Roberto's", cuisine: "Italian", borough: "Bronx", price: "$$$", address: "603 Crescent Ave" },
  { name: "Zero Otto Nove", cuisine: "Italian", borough: "Bronx", price: "$$$", address: "2357 Arthur Ave" },
  { name: "Dominick's", cuisine: "Italian", borough: "Bronx", price: "$$", address: "2335 Arthur Ave" },
  { name: "Mario's Restaurant", cuisine: "Italian", borough: "Bronx", price: "$$$", address: "2342 Arthur Ave" },
  { name: "Full Moon Pizza", cuisine: "Italian", borough: "Bronx", price: "$", address: "602 E 187th St" },
  { name: "Taco Mix", cuisine: "Mexican", borough: "Bronx", price: "$", address: "234 E Kingsbridge Rd" },
  { name: "Estrella Cubana", cuisine: "Cuban", borough: "Bronx", price: "$$", address: "2328 Arthur Ave" },
  { name: "Feeding Tree", cuisine: "Jamaican", borough: "Bronx", price: "$", address: "892 Gerard Ave" },
  { name: "Yankee Tavern", cuisine: "American", borough: "Bronx", price: "$$", address: "97 E 161st St" },
  
  // Staten Island
  { name: "Denino's Pizzeria", cuisine: "Italian", borough: "Staten Island", price: "$$", address: "524 Port Richmond Ave" },
  { name: "Joe & Pat's", cuisine: "Italian", borough: "Staten Island", price: "$$", address: "1747 Victory Blvd" },
  { name: "Angelina's Ristorante", cuisine: "Italian", borough: "Staten Island", price: "$$$", address: "26 Jefferson Blvd" },
  { name: "Aesop's Tables", cuisine: "American", borough: "Staten Island", price: "$$$", address: "1233 Bay St" },
  { name: "Cargo Cafe", cuisine: "American", borough: "Staten Island", price: "$$", address: "120 Bay St" },
  { name: "Enoteca Maria", cuisine: "Italian", borough: "Staten Island", price: "$$$", address: "27 Hyatt St" },
  { name: "Vida", cuisine: "American", borough: "Staten Island", price: "$$$", address: "381 Van Duzer St" },
  { name: "Beso", cuisine: "Spanish", borough: "Staten Island", price: "$$$", address: "11 Schuyler St" },
  { name: "Nurnberger Bierhaus", cuisine: "German", borough: "Staten Island", price: "$$", address: "817 Castleton Ave" },
  { name: "Adobe Blues", cuisine: "Southwestern", borough: "Staten Island", price: "$$", address: "63 Lafayette Ave" },
  
  // More Manhattan Restaurants
  { name: "Kiki's", cuisine: "Chinese", borough: "Manhattan", price: "$$", address: "130 Division St" },
  { name: "Beauty & Essex", cuisine: "American", borough: "Manhattan", price: "$$$", address: "146 Essex St" },
  { name: "Freemans", cuisine: "American", borough: "Manhattan", price: "$$$", address: "Freeman Alley" },
  { name: "Russ & Daughters", cuisine: "Jewish Deli", borough: "Manhattan", price: "$$$", address: "179 E Houston St" },
  { name: "Economy Candy", cuisine: "Dessert", borough: "Manhattan", price: "$", address: "108 Rivington St" },
  { name: "Doughnut Plant", cuisine: "Bakery", borough: "Manhattan", price: "$", address: "379 Grand St" },
  { name: "Clinton Bakery", cuisine: "Bakery", borough: "Manhattan", price: "$", address: "59 Mott St" },
  { name: "Russ & Daughters", cuisine: "Jewish Deli", borough: "Manhattan", price: "$$$", address: "179 E Houston St" },
  { name: "Yonah Schimmel", cuisine: "Jewish Deli", borough: "Manhattan", price: "$", address: "137 E Houston St" },
  { name: "Guss' Pickles", cuisine: "Jewish Deli", borough: "Manhattan", price: "$", address: "85 Orchard St" },
  { name: "Russ & Daughters", cuisine: "Jewish Deli", borough: "Manhattan", price: "$$$", address: "179 E Houston St" },
  { name: "Tenement Museum", cuisine: "American", borough: "Manhattan", price: "$$", address: "103 Orchard St" },
  { name: "Schaller & Weber", cuisine: "German", borough: "Manhattan", price: "$$", address: "1654 2nd Ave" },
  { name: "Heidelberg", cuisine: "German", borough: "Manhattan", price: "$$", address: "1648 2nd Ave" },
  { name: "Zum Schneider", cuisine: "German", borough: "Manhattan", price: "$$", address: "107 Ave C" },
  { name: "Paulaner Brauhaus", cuisine: "German", borough: "Manhattan", price: "$$", address: "265 Bowery" },
  { name: "Biergarten", cuisine: "German", borough: "Manhattan", price: "$$", address: "800 5th Ave" },
  { name: "Pig and Khao", cuisine: "Thai", borough: "Manhattan", price: "$$", address: "68 Clinton St" },
  { name: "Uncle Boons", cuisine: "Thai", borough: "Manhattan", price: "$$$", address: "7 Spring St" },
  { name: "Fish Cheeks", cuisine: "Thai", borough: "Manhattan", price: "$$", address: "55 Bond St" },
  { name: "Somtum Der", cuisine: "Thai", borough: "Manhattan", price: "$$", address: "85 Avenue A" },
  { name: "Pok Pok NY", cuisine: "Thai", borough: "Brooklyn", price: "$$", address: "117 Columbia St" },
  { name: "Ugly Baby", cuisine: "Thai", borough: "Brooklyn", price: "$$", address: "407 Smith St" },
  { name: "Zaab Zaab", cuisine: "Thai", borough: "Queens", price: "$$", address: "72-27 Roosevelt Ave" },
  { name: "Larb Ubol", cuisine: "Thai", borough: "Queens", price: "$$", address: "75-05 Woodside Ave" },
  { name: "Chao Thai", cuisine: "Thai", borough: "Queens", price: "$$", address: "85-03 Whitney Ave" },
  { name: "SriPraPhai", cuisine: "Thai", borough: "Queens", price: "$$", address: "64-13 39th Ave" },
  { name: "Pata Paplean", cuisine: "Thai", borough: "Queens", price: "$$", address: "40-06 Queens Blvd" },
  { name: "Zabb Elee", cuisine: "Thai", borough: "Queens", price: "$$", address: "71-28 Roosevelt Ave" },
  { name: "Enthaice", cuisine: "Thai", borough: "Queens", price: "$$", address: "79-20 Eliot Ave" },
  { name: "Khao Kang", cuisine: "Thai", borough: "Queens", price: "$", address: "76-20 Woodside Ave" },
  { name: "Mama's Empanadas", cuisine: "Latin American", borough: "Manhattan", price: "$", address: "763 9th Ave" },
  { name: "Empanada Mama", cuisine: "Latin American", borough: "Manhattan", price: "$", address: "763 9th Ave" },
  { name: "Cafe Habana", cuisine: "Cuban", borough: "Manhattan", price: "$$", address: "17 Prince St" },
  { name: "Sophie's Cuban", cuisine: "Cuban", borough: "Manhattan", price: "$", address: "73 New St" },
  { name: "Margon", cuisine: "Cuban", borough: "Manhattan", price: "$", address: "136 W 46th St" },
  { name: "Flor de Mayo", cuisine: "Peruvian", borough: "Manhattan", price: "$$", address: "2651 Broadway" },
  { name: "Pio Pio", cuisine: "Peruvian", borough: "Manhattan", price: "$$", address: "1746 1st Ave" },
  { name: "Chicken Festival", cuisine: "Peruvian", borough: "Manhattan", price: "$", address: "686 10th Ave" },
  { name: "Pollos a la Brasa Mario", cuisine: "Peruvian", borough: "Manhattan", price: "$$", address: "1482 2nd Ave" },
  { name: "Inca Grill", cuisine: "Peruvian", borough: "Manhattan", price: "$$", address: "492 Broome St" },
  { name: "Panca", cuisine: "Peruvian", borough: "Manhattan", price: "$$$", address: "92 7th Ave S" },
  { name: "Lima's Taste", cuisine: "Peruvian", borough: "Manhattan", price: "$$", address: "122 Christopher St" },
  { name: "Ceviche Bar", cuisine: "Peruvian", borough: "Manhattan", price: "$$$", address: "75 Broad St" },
  { name: "Raymi", cuisine: "Peruvian", borough: "Manhattan", price: "$$$", address: "43 W 24th St" },
  { name: "Llama Inn", cuisine: "Peruvian", borough: "Brooklyn", price: "$$$", address: "50 Withers St" },
  { name: "Ceviche", cuisine: "Peruvian", borough: "Brooklyn", price: "$$", address: "5402 5th Ave" },
  { name: "Pio Pio", cuisine: "Peruvian", borough: "Queens", price: "$$", address: "84-02 Northern Blvd" },
  { name: "Pollos a la Brasa", cuisine: "Peruvian", borough: "Queens", price: "$$", address: "91-16 Northern Blvd" },
  { name: "Urubamba", cuisine: "Peruvian", borough: "Queens", price: "$$", address: "86-20 37th Ave" },
  { name: "Inti Raymi", cuisine: "Peruvian", borough: "Queens", price: "$$", address: "86-14 37th Ave" },
  { name: "Cevicheria Tsunami", cuisine: "Peruvian", borough: "Queens", price: "$$", address: "77-02 Roosevelt Ave" },
  { name: "Machu Picchu", cuisine: "Peruvian", borough: "Queens", price: "$$", address: "85-07 Northern Blvd" },
  { name: "Chicken Festival", cuisine: "Peruvian", borough: "Queens", price: "$", address: "91-18 Roosevelt Ave" },
  { name: "Pollos Mario", cuisine: "Peruvian", borough: "Queens", price: "$$", address: "83-02 Northern Blvd" },
  { name: "Sabor Peruano", cuisine: "Peruvian", borough: "Queens", price: "$$", address: "108-01 Northern Blvd" },
  { name: "Pio Pio", cuisine: "Peruvian", borough: "Bronx", price: "$$", address: "702 E Fordham Rd" },
  { name: "Pollos a la Brasa", cuisine: "Peruvian", borough: "Bronx", price: "$$", address: "1874 Webster Ave" },
  { name: "Chicken Festival", cuisine: "Peruvian", borough: "Bronx", price: "$", address: "3040 3rd Ave" },
  { name: "Sabor Latino", cuisine: "Latin American", borough: "Bronx", price: "$$", address: "4264 White Plains Rd" },
  { name: "El Nuevo Bohio", cuisine: "Dominican", borough: "Bronx", price: "$$", address: "791 Prospect Ave" },
  { name: "Malecon", cuisine: "Dominican", borough: "Bronx", price: "$$", address: "4141 Broadway" },
  { name: "El Mambi", cuisine: "Cuban", borough: "Bronx", price: "$$", address: "1459 Webster Ave" },
  { name: "Havana Cafe", cuisine: "Cuban", borough: "Bronx", price: "$$", address: "3151 E Tremont Ave" },
  { name: "La Fonda Boricua", cuisine: "Puerto Rican", borough: "Bronx", price: "$$", address: "169 E 106th St" },
  { name: "Sofrito", cuisine: "Puerto Rican", borough: "Bronx", price: "$$", address: "400 E 57th St" },
  { name: "Borinquen", cuisine: "Puerto Rican", borough: "Bronx", price: "$$", address: "524 E 138th St" },
  { name: "El Paso Taqueria", cuisine: "Mexican", borough: "Manhattan", price: "$", address: "237 E 116th St" },
  { name: "Taco Mix", cuisine: "Mexican", borough: "Manhattan", price: "$", address: "234 E 116th St" },
  { name: "Casa Mexicana", cuisine: "Mexican", borough: "Manhattan", price: "$$", address: "133 Ludlow St" },
  { name: "Barrio Chino", cuisine: "Mexican", borough: "Manhattan", price: "$$", address: "253 Broome St" },
  { name: "Salvation Taco", cuisine: "Mexican", borough: "Manhattan", price: "$$", address: "145 E 39th St" },
  { name: "Toloache", cuisine: "Mexican", borough: "Manhattan", price: "$$$", address: "251 W 50th St" },
  { name: "Maya", cuisine: "Mexican", borough: "Manhattan", price: "$$$", address: "1191 1st Ave" },
  { name: "Rosa Mexicano", cuisine: "Mexican", borough: "Manhattan", price: "$$$", address: "9 E 18th St" },
  { name: "Mercadito", cuisine: "Mexican", borough: "Manhattan", price: "$$", address: "179 Ave B" },
  { name: "Suenos", cuisine: "Mexican", borough: "Manhattan", price: "$$$", address: "311 W 17th St" },
  { name: "Hecho en Dumbo", cuisine: "Mexican", borough: "Brooklyn", price: "$$$", address: "354 Bowery" },
  { name: "Gran Electrica", cuisine: "Mexican", borough: "Brooklyn", price: "$$$", address: "5 Front St" },
  { name: "Alma", cuisine: "Mexican", borough: "Brooklyn", price: "$$$", address: "187 Columbia St" },
  { name: "Chavela's", cuisine: "Mexican", borough: "Brooklyn", price: "$$", address: "736 Franklin Ave" },
  { name: "Mesa Coyoacan", cuisine: "Mexican", borough: "Brooklyn", price: "$$", address: "372 Graham Ave" },
  { name: "Fonda", cuisine: "Mexican", borough: "Brooklyn", price: "$$", address: "434 7th Ave" },
  { name: "Zona Rosa", cuisine: "Mexican", borough: "Brooklyn", price: "$$", address: "571 Lorimer St" },
  { name: "El Almacen", cuisine: "Mexican", borough: "Brooklyn", price: "$$", address: "557 Driggs Ave" },
  { name: "Tacos El Bronco", cuisine: "Mexican", borough: "Brooklyn", price: "$", address: "4324 4th Ave" },
  { name: "Sunset Park Taco", cuisine: "Mexican", borough: "Brooklyn", price: "$", address: "5116 5th Ave" },
  { name: "Taco Nuevo", cuisine: "Mexican", borough: "Queens", price: "$", address: "94-11 Corona Ave" },
  { name: "Tacos El Paisa", cuisine: "Mexican", borough: "Queens", price: "$", address: "97-07 Corona Ave" },
  { name: "Birria-Landia", cuisine: "Mexican", borough: "Queens", price: "$", address: "78-10 Roosevelt Ave" },
  { name: "Tacos Morelos", cuisine: "Mexican", borough: "Queens", price: "$", address: "89-04 Roosevelt Ave" },
  { name: "El Rey del Taco", cuisine: "Mexican", borough: "Queens", price: "$", address: "52-17 Roosevelt Ave" },
  { name: "Taqueria Coatzingo", cuisine: "Mexican", borough: "Queens", price: "$", address: "103-05 Roosevelt Ave" },
  { name: "Tacos El Paisa", cuisine: "Mexican", borough: "Queens", price: "$", address: "97-07 Corona Ave" },
  { name: "Birrieria Tijuana", cuisine: "Mexican", borough: "Queens", price: "$", address: "47-05 111th St" },
  { name: "Tacos El Güero", cuisine: "Mexican", borough: "Queens", price: "$", address: "94-11 Corona Ave" },
  { name: "El Mariachi Loco", cuisine: "Mexican", borough: "Queens", price: "$$", address: "41-17 National St" },
  { name: "Taco Bell", cuisine: "Mexican", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Chipotle", cuisine: "Mexican", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Qdoba", cuisine: "Mexican", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Dos Toros", cuisine: "Mexican", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Cafe Rio", cuisine: "Mexican", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Moe's Southwest Grill", cuisine: "Mexican", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Pancheros", cuisine: "Mexican", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Baja Fresh", cuisine: "Mexican", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "California Tortilla", cuisine: "Mexican", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Rubio's", cuisine: "Mexican", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "McDonald's", cuisine: "American", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Burger King", cuisine: "American", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Wendy's", cuisine: "American", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "KFC", cuisine: "American", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Popeyes", cuisine: "American", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Subway", cuisine: "American", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Dunkin'", cuisine: "American", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Starbucks", cuisine: "American", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Pizza Hut", cuisine: "Italian", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Domino's", cuisine: "Italian", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Papa John's", cuisine: "Italian", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Little Caesars", cuisine: "Italian", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Sbarro", cuisine: "Italian", borough: "Manhattan", price: "$", address: "Multiple Locations" },
  { name: "Olive Garden", cuisine: "Italian", borough: "Manhattan", price: "$$", address: "Multiple Locations" },
  { name: "Applebee's", cuisine: "American", borough: "Manhattan", price: "$$", address: "Multiple Locations" },
  { name: "TGI Friday's", cuisine: "American", borough: "Manhattan", price: "$$", address: "Multiple Locations" },
  { name: "Chili's", cuisine: "American", borough: "Manhattan", price: "$$", address: "Multiple Locations" },
  { name: "Red Lobster", cuisine: "Seafood", borough: "Manhattan", price: "$$", address: "Multiple Locations" },
  { name: "Outback Steakhouse", cuisine: "Steakhouse", borough: "Manhattan", price: "$$$", address: "Multiple Locations" },
  { name: "Texas Roadhouse", cuisine: "Steakhouse", borough: "Manhattan", price: "$$", address: "Multiple Locations" },
  { name: "LongHorn Steakhouse", cuisine: "Steakhouse", borough: "Manhattan", price: "$$", address: "Multiple Locations" },
  { name: "Ruth's Chris", cuisine: "Steakhouse", borough: "Manhattan", price: "$$$$", address: "Multiple Locations" },
  { name: "Morton's", cuisine: "Steakhouse", borough: "Manhattan", price: "$$$$", address: "Multiple Locations" },
  { name: "The Capital Grille", cuisine: "Steakhouse", borough: "Manhattan", price: "$$$$", address: "Multiple Locations" },
  { name: "Del Frisco's", cuisine: "Steakhouse", borough: "Manhattan", price: "$$$$", address: "Multiple Locations" },
  { name: "STK", cuisine: "Steakhouse", borough: "Manhattan", price: "$$$$", address: "Multiple Locations" },
  { name: "Benjamin Steakhouse", cuisine: "Steakhouse", borough: "Manhattan", price: "$$$$", address: "Multiple Locations" },
  { name: "Strip House", cuisine: "Steakhouse", borough: "Manhattan", price: "$$$$", address: "Multiple Locations" },
  
  // Hidden Gems - Manhattan
  { name: "Dimes Market", cuisine: "American", borough: "Manhattan", price: "$$", address: "85 Willett St" },
  { name: "Kopitiam", cuisine: "Malaysian", borough: "Manhattan", price: "$$", address: "151 E Broadway" },
  { name: "Cervo's", cuisine: "Spanish", borough: "Manhattan", price: "$$$", address: "43 Canal St" },
  { name: "Wildair", cuisine: "American", borough: "Manhattan", price: "$$$", address: "142 Orchard St" },
  { name: "Contra", cuisine: "American", borough: "Manhattan", price: "$$$$", address: "138 Orchard St" },
  { name: "Estela", cuisine: "Mediterranean", borough: "Manhattan", price: "$$$", address: "47 E Houston St" },
  { name: "Kiki's", cuisine: "Greek", borough: "Manhattan", price: "$$", address: "130 Division St" },
  { name: "Forgtmenot", cuisine: "American", borough: "Manhattan", price: "$$", address: "138 Division St" },
  { name: "Congee Village", cuisine: "Chinese", borough: "Manhattan", price: "$$", address: "100 Allen St" },
  { name: "Spicy Village", cuisine: "Chinese", borough: "Manhattan", price: "$", address: "68 Forsyth St" },
  { name: "Tasty Hand-Pulled Noodles", cuisine: "Chinese", borough: "Manhattan", price: "$", address: "1 Doyers St" },
  { name: "Nom Wah Tea Parlor", cuisine: "Chinese", borough: "Manhattan", price: "$$", address: "13 Doyers St" },
  { name: "Punjabi Grocery & Deli", cuisine: "Indian", borough: "Manhattan", price: "$", address: "114 E 1st St" },
  { name: "Milon", cuisine: "Bangladeshi", borough: "Manhattan", price: "$", address: "93 1st Ave" },
  { name: "Katz & Dogz", cuisine: "American", borough: "Manhattan", price: "$", address: "2 St Marks Pl" },
  { name: "Motorino", cuisine: "Italian", borough: "Manhattan", price: "$$", address: "349 E 12th St" },
  { name: "Prune", cuisine: "American", borough: "Manhattan", price: "$$$", address: "54 E 1st St" },
  { name: "Hearth", cuisine: "Italian", borough: "Manhattan", price: "$$$", address: "403 E 12th St" },
  { name: "Pylos", cuisine: "Greek", borough: "Manhattan", price: "$$$", address: "128 E 7th St" },
  { name: "Hasaki", cuisine: "Japanese", borough: "Manhattan", price: "$$", address: "210 E 9th St" },
  { name: "Sobaya", cuisine: "Japanese", borough: "Manhattan", price: "$$", address: "229 E 9th St" },
  { name: "Kanoyama", cuisine: "Japanese", borough: "Manhattan", price: "$$$", address: "175 2nd Ave" },
  { name: "15 East", cuisine: "Japanese", borough: "Manhattan", price: "$$$$", address: "15 E 15th St" },
  { name: "Gramercy Tavern", cuisine: "American", borough: "Manhattan", price: "$$$$", address: "42 E 20th St" },
  { name: "ABC Kitchen", cuisine: "American", borough: "Manhattan", price: "$$$", address: "35 E 18th St" },
  { name: "Gotham Bar and Grill", cuisine: "American", borough: "Manhattan", price: "$$$$", address: "12 E 12th St" },
  { name: "One if by Land", cuisine: "American", borough: "Manhattan", price: "$$$$", address: "17 Barrow St" },
  { name: "Minetta Tavern", cuisine: "French", borough: "Manhattan", price: "$$$$", address: "113 MacDougal St" },
  { name: "Buvette", cuisine: "French", borough: "Manhattan", price: "$$", address: "42 Grove St" },
  { name: "Rosemary's", cuisine: "Italian", borough: "Manhattan", price: "$$$", address: "18 Greenwich Ave" },
  { name: "Lupa", cuisine: "Italian", borough: "Manhattan", price: "$$$", address: "170 Thompson St" },
  { name: "Babbo", cuisine: "Italian", borough: "Manhattan", price: "$$$$", address: "110 Waverly Pl" },
  { name: "Otto", cuisine: "Italian", borough: "Manhattan", price: "$$", address: "1 5th Ave" },
  { name: "Perla", cuisine: "Italian", borough: "Manhattan", price: "$$$", address: "24 Minetta Ln" },
  { name: "Cacio e Pepe", cuisine: "Italian", borough: "Manhattan", price: "$$", address: "182 2nd Ave" },
  { name: "Supper", cuisine: "Italian", borough: "Manhattan", price: "$$", address: "156 E 2nd St" },
  { name: "Frank", cuisine: "Italian", borough: "Manhattan", price: "$$", address: "88 2nd Ave" },
  { name: "Lil' Frankie's", cuisine: "Italian", borough: "Manhattan", price: "$$", address: "19 1st Ave" },
  { name: "Sauce", cuisine: "Italian", borough: "Manhattan", price: "$$", address: "78 Rivington St" },
  
  // Hidden Gems - Brooklyn
  { name: "Oxomoco", cuisine: "Mexican", borough: "Brooklyn", price: "$$$", address: "128 Greenpoint Ave" },
  { name: "Lilia", cuisine: "Italian", borough: "Brooklyn", price: "$$$$", address: "567 Union Ave" },
  { name: "Misi", cuisine: "Italian", borough: "Brooklyn", price: "$$$", address: "329 Kent Ave" },
  { name: "Cecconi's", cuisine: "Italian", borough: "Brooklyn", price: "$$$", address: "1 Main St" },
  { name: "Aska", cuisine: "Scandinavian", borough: "Brooklyn", price: "$$$$", address: "47 South 5th St" },
  { name: "Olmsted", cuisine: "American", borough: "Brooklyn", price: "$$$", address: "659 Vanderbilt Ave" },
  { name: "Faun", cuisine: "Italian", borough: "Brooklyn", price: "$$$", address: "606 Vanderbilt Ave" },
  { name: "Miriam", cuisine: "Israeli", borough: "Brooklyn", price: "$$$", address: "79 5th Ave" },
  { name: "Tanoreen", cuisine: "Middle Eastern", borough: "Brooklyn", price: "$$", address: "7523 3rd Ave" },
  { name: "Al Badawi", cuisine: "Middle Eastern", borough: "Brooklyn", price: "$$", address: "8220 5th Ave" },
  { name: "Sahadi's", cuisine: "Middle Eastern", borough: "Brooklyn", price: "$", address: "187 Atlantic Ave" },
  { name: "Yemen Cafe", cuisine: "Middle Eastern", borough: "Brooklyn", price: "$", address: "176 Atlantic Ave" },
  { name: "Damascus Bread & Pastry", cuisine: "Middle Eastern", borough: "Brooklyn", price: "$", address: "195 Atlantic Ave" },
  { name: "Momo Sushi Shack", cuisine: "Japanese", borough: "Brooklyn", price: "$$", address: "43 Bogart St" },
  { name: "Shuko", cuisine: "Japanese", borough: "Brooklyn", price: "$$$$", address: "47 E 12th St" },
  { name: "Nakazawa", cuisine: "Japanese", borough: "Brooklyn", price: "$$$$", address: "23 Commerce St" },
  { name: "Ganso", cuisine: "Japanese", borough: "Brooklyn", price: "$$", address: "25 Bond St" },
  { name: "Ivan Ramen", cuisine: "Japanese", borough: "Brooklyn", price: "$$", address: "25 Clinton St" },
  { name: "Chuko", cuisine: "Japanese", borough: "Brooklyn", price: "$$", address: "565 Vanderbilt Ave" },
  { name: "Ramen Yebisu", cuisine: "Japanese", borough: "Brooklyn", price: "$$", address: "1 N 7th St" },
  { name: "Zenkichi", cuisine: "Japanese", borough: "Brooklyn", price: "$$$", address: "77 N 6th St" },
  { name: "Okonomi", cuisine: "Japanese", borough: "Brooklyn", price: "$$", address: "150 Ainslie St" },
  { name: "Karasu", cuisine: "Japanese", borough: "Brooklyn", price: "$$", address: "422 Union Ave" },
  { name: "Bunna Cafe", cuisine: "Ethiopian", borough: "Brooklyn", price: "$$", address: "1084 Flushing Ave" },
  { name: "Zoma", cuisine: "Ethiopian", borough: "Brooklyn", price: "$$", address: "2084 Frederick Douglass Blvd" },
  { name: "Mekelburg's", cuisine: "American", borough: "Brooklyn", price: "$$", address: "293 Grand St" },
  { name: "Rucola", cuisine: "Italian", borough: "Brooklyn", price: "$$$", address: "190 Dean St" },
  { name: "Convivium Osteria", cuisine: "Italian", borough: "Brooklyn", price: "$$$", address: "68 5th Ave" },
  { name: "Scottadito Osteria", cuisine: "Italian", borough: "Brooklyn", price: "$$$", address: "788 Union St" },
  { name: "Grano", cuisine: "Italian", borough: "Brooklyn", price: "$$", address: "413 Graham Ave" },
  { name: "Ops", cuisine: "Italian", borough: "Brooklyn", price: "$$", address: "346 Himrod St" },
  { name: "Paulie Gee's", cuisine: "Italian", borough: "Brooklyn", price: "$$", address: "60 Greenpoint Ave" },
  { name: "L'industrie Pizzeria", cuisine: "Italian", borough: "Brooklyn", price: "$$", address: "254 S 2nd St" },
  { name: "Speedy Romeo", cuisine: "Italian", borough: "Brooklyn", price: "$$", address: "376 Classon Ave" },
  { name: "Don Antonio", cuisine: "Italian", borough: "Brooklyn", price: "$$", address: "309 E 50th St" },
  
  // Hidden Gems - Queens
  { name: "Mu Ramen", cuisine: "Japanese", borough: "Queens", price: "$$", address: "1209 Jackson Ave" },
  { name: "M. Wells Steakhouse", cuisine: "French", borough: "Queens", price: "$$$$", address: "43-15 Crescent St" },
  { name: "Taverna Kyclades", cuisine: "Greek", borough: "Queens", price: "$$$", address: "33-07 Ditmars Blvd" },
  { name: "Agnanti", cuisine: "Greek", borough: "Queens", price: "$$$", address: "19-06 Ditmars Blvd" },
  { name: "Elias Corner", cuisine: "Greek", borough: "Queens", price: "$$", address: "24-02 31st St" },
  { name: "Stamatis", cuisine: "Greek", borough: "Queens", price: "$$", address: "29-09 23rd Ave" },
  { name: "Gregory's 26 Corner Taverna", cuisine: "Greek", borough: "Queens", price: "$$", address: "26-02 23rd Ave" },
  { name: "Bahari Estiatorio", cuisine: "Greek", borough: "Queens", price: "$$$", address: "31-14 Broadway" },
  { name: "Telly's Taverna", cuisine: "Greek", borough: "Queens", price: "$$", address: "28-13 23rd Ave" },
  { name: "Zenon Taverna", cuisine: "Greek", borough: "Queens", price: "$$", address: "34-10 31st Ave" },
  { name: "Sik Gaek", cuisine: "Korean", borough: "Queens", price: "$$", address: "49-11 Roosevelt Ave" },
  { name: "Hahm Ji Bach", cuisine: "Korean", borough: "Queens", price: "$$", address: "41-06 149th Pl" },
  { name: "Madangsui", cuisine: "Korean", borough: "Queens", price: "$$", address: "35-16 Northern Blvd" },
  { name: "Jongro BBQ", cuisine: "Korean", borough: "Queens", price: "$$", address: "22-36 Northern Blvd" },
  { name: "New York Kom Tang Soot Bull House", cuisine: "Korean", borough: "Queens", price: "$$", address: "32-07 Northern Blvd" },
  { name: "BCD Tofu House", cuisine: "Korean", borough: "Queens", price: "$$", address: "41-06 Northern Blvd" },
  { name: "Picnic Garden", cuisine: "Korean", borough: "Queens", price: "$$", address: "42-32 Bell Blvd" },
  { name: "Hanjan", cuisine: "Korean", borough: "Manhattan", price: "$$$", address: "36 W 26th St" },
  { name: "Her Name is Han", cuisine: "Korean", borough: "Manhattan", price: "$$", address: "17 E 31st St" },
  { name: "Kristalbelli", cuisine: "Korean", borough: "Manhattan", price: "$$$", address: "8 W 36th St" },
  { name: "Mokbar", cuisine: "Korean", borough: "Brooklyn", price: "$$", address: "214 Moore St" },
  { name: "Miss Korea", cuisine: "Korean", borough: "Manhattan", price: "$$", address: "10 W 32nd St" },
  { name: "Gam Mee Ok", cuisine: "Korean", borough: "Manhattan", price: "$$", address: "43 W 32nd St" },
  { name: "Woorijip", cuisine: "Korean", borough: "Manhattan", price: "$", address: "12 W 32nd St" },
  { name: "Cho Dang Gol", cuisine: "Korean", borough: "Manhattan", price: "$$", address: "55 W 35th St" },
  { name: "New Wonjo", cuisine: "Korean", borough: "Manhattan", price: "$$", address: "23 W 32nd St" },
  { name: "Kang Ho Dong Baekjeong", cuisine: "Korean", borough: "Manhattan", price: "$$$", address: "1 E 32nd St" },
  
  // Hidden Gems - Bronx
  { name: "Estrella Cubana", cuisine: "Cuban", borough: "Bronx", price: "$$", address: "2328 Arthur Ave" },
  { name: "Emilia's", cuisine: "Italian", borough: "Bronx", price: "$$$", address: "2331 Arthur Ave" },
  { name: "Ann & Tony's", cuisine: "Italian", borough: "Bronx", price: "$$", address: "2407 Arthur Ave" },
  { name: "Pasquale's Rigoletto", cuisine: "Italian", borough: "Bronx", price: "$$$", address: "2311 Arthur Ave" },
  { name: "Tra Di Noi", cuisine: "Italian", borough: "Bronx", price: "$$$", address: "622 E 187th St" },
  { name: "Enzo's of Arthur Ave", cuisine: "Italian", borough: "Bronx", price: "$$", address: "2339 Arthur Ave" },
  { name: "Giovanni's", cuisine: "Italian", borough: "Bronx", price: "$$", address: "2343 Arthur Ave" },
  { name: "Gino's", cuisine: "Italian", borough: "Bronx", price: "$$", address: "2348 Arthur Ave" },
  { name: "Cosenza's Fish Market", cuisine: "Italian", borough: "Bronx", price: "$$", address: "2354 Arthur Ave" },
  { name: "Mike's Deli", cuisine: "Italian", borough: "Bronx", price: "$", address: "2344 Arthur Ave" },
  { name: "Madonia Brothers Bakery", cuisine: "Italian", borough: "Bronx", price: "$", address: "2348 Arthur Ave" },
  { name: "Egidio Pastry Shop", cuisine: "Italian", borough: "Bronx", price: "$", address: "622 E 187th St" },
  { name: "DeLillo Pastry Shop", cuisine: "Italian", borough: "Bronx", price: "$", address: "610 E 187th St" },
  { name: "Randazzo's Seafood", cuisine: "Italian", borough: "Bronx", price: "$$", address: "2327 Arthur Ave" },
  { name: "Biancardi Meats", cuisine: "Italian", borough: "Bronx", price: "$$", address: "2350 Arthur Ave" },
  
  // Hidden Gems - Staten Island
  { name: "Enoteca Maria", cuisine: "Italian", borough: "Staten Island", price: "$$$", address: "27 Hyatt St" },
  { name: "Vida", cuisine: "American", borough: "Staten Island", price: "$$$", address: "381 Van Duzer St" },
  { name: "Beso", cuisine: "Spanish", borough: "Staten Island", price: "$$$", address: "11 Schuyler St" },
  { name: "Cafe Luna", cuisine: "Italian", borough: "Staten Island", price: "$$", address: "31 Page Ave" },
  { name: "Trattoria Romana", cuisine: "Italian", borough: "Staten Island", price: "$$", address: "1476 Hylan Blvd" },
  { name: "Bocelli", cuisine: "Italian", borough: "Staten Island", price: "$$$", address: "1250 Hylan Blvd" },
  { name: "Da Noi", cuisine: "Italian", borough: "Staten Island", price: "$$$", address: "4358 Victory Blvd" },
  { name: "Arirang Hibachi Steakhouse", cuisine: "Japanese", borough: "Staten Island", price: "$$$", address: "2230 Forest Ave" },
  { name: "Lakruwana", cuisine: "Sri Lankan", borough: "Staten Island", price: "$$", address: "668 Bay St" },
  { name: "New Asha", cuisine: "Sri Lankan", borough: "Staten Island", price: "$$", address: "322 Victory Blvd" },
  { name: "Hop Kee", cuisine: "Chinese", borough: "Staten Island", price: "$$", address: "31 Page Ave" },
  { name: "Royal Crown", cuisine: "Caribbean", borough: "Staten Island", price: "$$", address: "1594 Forest Ave" },
  { name: "Lee's Tavern", cuisine: "American", borough: "Staten Island", price: "$$", address: "60 Hancock St" },
  { name: "Killmeyer's Old Bavaria Inn", cuisine: "German", borough: "Staten Island", price: "$$", address: "4254 Arthur Kill Rd" },
  { name: "Cargo Cafe", cuisine: "American", borough: "Staten Island", price: "$$", address: "120 Bay St" }
];

export default function RestaurantFinder() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [filters, setFilters] = useState({
    borough: 'all',
    cuisine: 'all',
    price: 'all'
  });

  const boroughs = ['all', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
  const cuisines = ['all', ...new Set(restaurants.map(r => r.cuisine))];
  const prices = ['all', '$', '$$', '$$$', '$$$$'];

  const getFilteredRestaurants = () => {
    return restaurants.filter(restaurant => {
      return (filters.borough === 'all' || restaurant.borough === filters.borough) &&
             (filters.cuisine === 'all' || restaurant.cuisine === filters.cuisine) &&
             (filters.price === 'all' || restaurant.price === filters.price);
    });
  };

  const getRandomRestaurant = () => {
    const filtered = getFilteredRestaurants();
    if (filtered.length === 0) {
      alert('No restaurants match your filters. Try adjusting them!');
      return;
    }
    const randomIndex = Math.floor(Math.random() * filtered.length);
    setSelectedRestaurant(filtered[randomIndex]);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <Center style={{ position: 'relative', zIndex: 10, pointerEvents: 'all' }}>
      <h1>NYC Eats</h1>
      <p style={{ color: '#e1d0e9', fontSize: '18px', marginBottom: '30px' }}>
        Discover your next favorite restaurant in the Big Apple
      </p>
      
      <FilterContainer>
        <FilterGroup>
          <FilterLabel>Borough</FilterLabel>
          <FilterSelect 
            value={filters.borough} 
            onChange={(e) => handleFilterChange('borough', e.target.value)}
          >
            {boroughs.map(borough => (
              <option key={borough} value={borough}>
                {borough === 'all' ? 'All Boroughs' : borough}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Cuisine</FilterLabel>
          <FilterSelect 
            value={filters.cuisine} 
            onChange={(e) => handleFilterChange('cuisine', e.target.value)}
          >
            {cuisines.map(cuisine => (
              <option key={cuisine} value={cuisine}>
                {cuisine === 'all' ? 'All Cuisines' : cuisine}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Price Range</FilterLabel>
          <FilterSelect 
            value={filters.price} 
            onChange={(e) => handleFilterChange('price', e.target.value)}
          >
            {prices.map(price => (
              <option key={price} value={price}>
                {price === 'all' ? 'All Prices' : price}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>
      </FilterContainer>

      <RandomButton onClick={getRandomRestaurant}>
        Find My Restaurant
      </RandomButton>

      {selectedRestaurant && (
        <RestaurantCard>
          <h2>{selectedRestaurant.name}</h2>
          <p className="cuisine">{selectedRestaurant.cuisine}</p>
          <p className="price">{selectedRestaurant.price}</p>
          <p className="borough">{selectedRestaurant.borough}</p>
          <p>{selectedRestaurant.address}</p>
        </RestaurantCard>
      )}

      <p style={{ color: '#b5b5c8', fontSize: '14px', marginTop: '40px' }}>
        Showing {getFilteredRestaurants().length} restaurants with current filters
      </p>
    </Center>
  );
} 