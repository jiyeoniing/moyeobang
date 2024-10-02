import {createFileRoute} from '@tanstack/react-router';
import Login from '@/components/Login/Login';

export const Route = createFileRoute('/_layout/entrance/')({
  component: Login,
});
