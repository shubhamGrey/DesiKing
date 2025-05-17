// pages/product.js
import { useRouter } from 'next/router';
import { Container, Typography, Button, Grid, Card, CardMedia } from '@mui/material';

const products = [
  {
    id: '1',
    name: 'Turmeric Powder',
    description: 'High-quality turmeric powder, perfect for all your culinary needs.',
    price: '₹150',
    image: 'https://www.agronexis.com/panel/assets/images/680b3203c6721_20250425_122603.jpg',
  },
  {
    id: '2',
    name: 'Cumin Powder',
    description: 'Freshly ground cumin powder with a rich flavor.',
    price: '₹120',
    image: 'https://www.agronexis.com/panel/assets/images/680b3667af894_20250425_124447.jpg',
  },
  {
    id: '3',
    name: 'Coriander Powder',
    description: 'Fragrant and flavorful coriander powder.',
    price: '₹130',
    image: 'https://www.agronexis.com/panel/assets/images/680b362488f41_20250425_124340.jpg',
  },
  {
    id: '4',
    name: 'Red Chilli Powder',
    description: 'Spicy red chilli powder that adds the perfect kick to your food.',
    price: '₹140',
    image: 'https://www.agronexis.com/panel/assets/images/680b376492725_20250425_124900.jpg',
  },
];

export default function Product() {
  const router = useRouter();
  const { id } = router.query;

  const product = products.find((prod) => prod.id == id);

  return (
    <Container>
      {product ? (
        <Grid container spacing={4}>
          <Grid size={12}>
            <Card>
              <CardMedia
                component="img"
                height="400"
                image={product.image}
                alt={product.name}
              />
            </Card>
          </Grid>
          <Grid size={12}>
            <Typography variant="h3">{product.name}</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {product.description}
            </Typography>
            <Typography variant="h4">{product.price}</Typography>
            <Button variant="contained" color="primary" fullWidth>
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h5" color="error">
          Product not found.
        </Typography>
      )}
    </Container>
  );
}
