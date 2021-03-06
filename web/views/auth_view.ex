defmodule Adpq.AuthView do
  use Adpq.Web, :view

  def render("show.json", %{auth: user}) do
    render_one(user, Adpq.AuthView, "auth.json")
  end

  def render("auth.json", %{auth: user}) do
    %{
      id: user.id,
      name: user.name,
      role: user.role
    }
  end

end
