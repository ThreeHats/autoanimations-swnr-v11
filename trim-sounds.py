import os
import json
import fnmatch
import urllib.parse
import sys

def extract_sound_references(data):
    """Extract all sound file references from JSON data."""
    references = []
    
    if isinstance(data, dict):
        for key, value in data.items():
            if key == "file" and isinstance(value, str) and "/sounds/" in value:
                references.append(value)
            else:
                references.extend(extract_sound_references(value))
    elif isinstance(data, list):
        for item in data:
            references.extend(extract_sound_references(item))
    
    return references

def main():
    # Define paths
    json_path = r".\fvtt-AutomatedAnimations-GlobalMenu-swnr.json"
    sounds_dir = r".\sounds"
    
    # Check if paths exist
    if not os.path.exists(json_path):
        print(f"Error: JSON file not found at {json_path}")
        return
    
    if not os.path.exists(sounds_dir):
        print(f"Error: Sounds directory not found at {sounds_dir}")
        return
    
    # Load JSON data
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return
    except Exception as e:
        print(f"Error reading JSON file: {e}")
        return
    
    # Extract sound file references
    sound_references = extract_sound_references(data)
    
    # Split references into exact matches and wildcard patterns
    exact_refs = set()
    wildcard_patterns = set()
    
    # Process references to extract paths and identify wildcards
    for ref in sound_references:
        # Extract part after "/sounds/"
        parts = ref.split("/sounds/")
        if len(parts) != 2:
            continue
            
        # URL decode the path part
        path_part = urllib.parse.unquote(parts[1])
        
        # Convert to OS-specific path format
        os_path = os.path.normpath(path_part)
        
        # Check if it contains wildcards
        if '*' in os_path:
            wildcard_patterns.add(os_path)
        else:
            exact_refs.add(os_path)
    
    print(f"Found {len(sound_references)} sound references in JSON")
    print(f"Exact path references: {len(exact_refs)}")
    print(f"Wildcard patterns: {len(wildcard_patterns)}")
    
    # Walk through all subdirectories to find all sound files
    all_sound_files = []
    for root, dirs, files in os.walk(sounds_dir):
        # Get relative path from the sounds directory
        rel_root = os.path.relpath(root, sounds_dir)
        
        for file in files:
            if rel_root == '.':
                rel_path = file  # File is directly in sounds_dir
            else:
                rel_path = os.path.join(rel_root, file)
            
            all_sound_files.append((os.path.normpath(rel_path), os.path.join(root, file)))
    
    print(f"Total sound files in directory: {len(all_sound_files)}")
    
    # Determine which files to keep and which to delete
    files_to_delete = []
    for rel_path, full_path in all_sound_files:
        # Check if file matches any reference
        if rel_path in exact_refs:
            continue
        
        # Check against wildcard patterns
        matched = False
        for pattern in wildcard_patterns:
            if fnmatch.fnmatch(rel_path, pattern):
                matched = True
                break
        
        if not matched:
            files_to_delete.append((rel_path, full_path))
    
    print(f"Files to delete: {len(files_to_delete)}")
    
    # Confirm deletion
    if files_to_delete:
        print("\nFiles that will be deleted (showing first 20):")
        for i, (rel_path, _) in enumerate(sorted(files_to_delete)[:20]):
            print(f"- {rel_path}")
            
        if len(files_to_delete) > 20:
            print(f"... and {len(files_to_delete) - 20} more files")
        
        confirm = input(f"\nDo you want to proceed with deletion? (yes/no): ")
        if confirm.lower() == 'yes':
            # Delete the files
            deleted_count = 0
            for rel_path, full_path in files_to_delete:
                try:
                    os.remove(full_path)
                    print(f"Deleted: {rel_path}")
                    deleted_count += 1
                except Exception as e:
                    print(f"Error deleting {rel_path}: {e}")
            
            print(f"\nDeleted {deleted_count} unreferenced sound files.")
            
            # Clean up empty directories
            print("\nRemoving empty directories...")
            empty_dirs_removed = 0
            
            # Walk bottom-up to remove empty directories
            for root, dirs, files in os.walk(sounds_dir, topdown=False):
                # Skip the sounds directory itself
                if root == sounds_dir:
                    continue
                    
                # Check if directory is empty (no files and no subdirectories)
                if not os.listdir(root):
                    try:
                        os.rmdir(root)
                        rel_dir = os.path.relpath(root, sounds_dir)
                        print(f"Removed empty directory: {rel_dir}")
                        empty_dirs_removed += 1
                    except Exception as e:
                        print(f"Error removing directory {root}: {e}")
            
            print(f"Removed {empty_dirs_removed} empty directories.")
        else:
            print("Deletion cancelled.")
    else:
        print("No files to delete.")

if __name__ == "__main__":
    main()