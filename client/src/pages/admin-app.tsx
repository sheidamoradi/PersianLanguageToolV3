import { Route, Switch } from "wouter";
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "./admin/dashboard";
import AdminPosts from "./admin/posts";
import AdminMedia from "./admin/media";
import AdminAppearance from "./admin/appearance";

export default function AdminApp() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/posts" component={AdminPosts} />
        <Route path="/admin/media" component={AdminMedia} />
        <Route path="/admin/appearance" component={AdminAppearance} />
        <Route>
          <AdminDashboard />
        </Route>
      </Switch>
    </AdminLayout>
  );
}