const AdminDropdown = () => {
    return (
      <div className="dropdown">
        <button className="dropbtn">ADMIN</button>
        <div className="dropdown-content">
          <a href="#">Upload</a>
          <a href="#">ShowImported</a>
          <a href="#">Citations</a>
          {/* Ajoutez d'autres actions ici si nécessaire */}
        </div>
      </div>
    );
  };

  export default AdminDropdown;
  