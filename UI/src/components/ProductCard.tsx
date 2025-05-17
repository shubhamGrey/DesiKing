// components/ProductCard.js
import { Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import { useRouter } from 'next/router';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  const handleViewProduct = () => {
    router.push(`/product?id=${product.id}`);
  };

  return (
    <Card>
      <CardActionArea onClick={handleViewProduct}>
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
        />
        <CardContent>
          <Typography variant="h6">{product.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
          <Typography variant="h5">{product.price}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
