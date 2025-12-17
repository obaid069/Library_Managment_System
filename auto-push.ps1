# Auto Push Script - Pushes files one by one to GitHub

# First, commit and push already staged files
$stagedFiles = @(
    "backend/models/LabTest.js",
    "backend/models/Medicine.js",
    "backend/models/Ward.js"
)

Write-Host "=== Processing Staged Files ===" -ForegroundColor Cyan

foreach ($file in $stagedFiles) {
    Write-Host "`nProcessing: $file" -ForegroundColor Yellow
    
    # Commit the file (already staged)
    $commitMsg = "Add $($file.Split('/')[-1])"
    git commit -m $commitMsg
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Committed: $file" -ForegroundColor Green
        
        # Push to GitHub
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Pushed: $file" -ForegroundColor Green
        } else {
            Write-Host "Failed to push: $file" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Failed to commit: $file" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 1
}

# Now process untracked files
$untrackedFiles = @(
    "backend/routes/billing.js",
    "backend/routes/labtests.js",
    "backend/routes/medicines.js",
    "backend/routes/pharmacy.js",
    "backend/routes/wards.js",
    "frontend/src/components/Layout.jsx",
    "frontend/src/components/Sidebar.jsx",
    "frontend/src/pages/DoctorsList.jsx",
    "frontend/src/pages/doctor/CompleteAppointment.jsx",
    "frontend/src/pages/staff/PharmacyManagement.jsx",
    "frontend/src/services/billing.service.js",
    "frontend/src/services/labtest.service.js",
    "frontend/src/services/medicine.service.js",
    "frontend/src/services/pharmacy.service.js",
    "frontend/src/services/ward.service.js"
)

Write-Host "`n=== Processing Untracked Files ===" -ForegroundColor Cyan

foreach ($file in $untrackedFiles) {
    Write-Host "`nProcessing: $file" -ForegroundColor Yellow
    
    # Add the file
    git add $file
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Added: $file" -ForegroundColor Green
        
        # Commit the file
        $commitMsg = "Add $($file.Split('/')[-1])"
        git commit -m $commitMsg
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Committed: $file" -ForegroundColor Green
            
            # Push to GitHub
            git push origin main
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Pushed: $file" -ForegroundColor Green
            } else {
                Write-Host "Failed to push: $file" -ForegroundColor Red
                exit 1
            }
        } else {
            Write-Host "Failed to commit: $file" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Failed to add: $file" -ForegroundColor Red
        exit 1
    }
    
    Start-Sleep -Seconds 1
}

Write-Host "`n=== All files pushed successfully! ===" -ForegroundColor Green
