
export default function EditableTitle({ photo, onEditStart, onEditSubmit }) {
    const { id, title, name } = photo;
    const [localTitle, setLocalTitle] = useState(title || name);
  
    useEffect(() => {
      if (!editingId || editingId !== id) {
        setLocalTitle(title || name);
      }
    }, [editingId, id, title, name]);
  
    if (editingId === id) {
      return (
        <form onSubmit={e => {
          e.preventDefault();
          onEditSubmit(id, localTitle);
        }}>
          <input
            type="text"
            value={localTitle}
            onChange={e => setLocalTitle(e.target.value)}
            autoFocus
          />
          <button type="submit">Save</button>
        </form>
      );
    }
  
    return (
      <div onDoubleClick={() => onEditStart(id)}>
        {localTitle || name} NAME
        <button onClick={() => onEditStart(id)}><i className="fa fa-pencil"></i></button>
      </div>
    );
  }


  