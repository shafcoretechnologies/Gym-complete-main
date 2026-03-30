# Client Handoff Guide

This guide is for clients who want to update website content safely.

## What You Are Getting

You have access to a private content editor for your gym website.

You can update:

- gym name
- phone number
- email
- address
- timings
- hero text
- section copy
- pricing
- copyright text

Some technical and SEO-sensitive fields are intentionally locked so the live website stays clean and stable.

## Safe Editing Workflow

1. Open the private admin editor locally
2. Make your content changes
3. Click `Export JSON`
4. Share the exported `content.json` with the website manager
5. The updated file is published to the live website

## Important

The live website does not update just by editing the admin form.

The admin creates an updated `content.json` file, and that file must be published to the server.

## How To Use the Admin

### Step 1: Open the editor

Open:

```text
/admin/index.html
```

Use it locally or on a private editing machine.

### Step 2: Update your content

Edit the fields you need:

- contact details
- timings
- home page text
- pricing

### Step 3: Save your draft

Click `Save Draft` if you want to keep your latest local changes before exporting.

### Step 4: Export your content

Click `Export JSON`.

This downloads a file named:

```text
content.json
```

### Step 5: Send for publishing

Send that file to the person managing your website hosting, or follow your internal publish process.

## Best Practices

- Keep one backup copy of every exported JSON file
- Use clear filenames if saving multiple versions
- Validate major changes before publishing
- Change one thing at a time if you are unsure

## Troubleshooting

### My edits are not visible on the live website

That usually means the new `content.json` has not been published yet.

### The admin says editing is disabled

Open the editor locally or on `localhost`.

### WhatsApp links are wrong

Check the phone number field and use the country code without `+`.

## Support Workflow

Recommended process:

1. Client edits content
2. Client exports JSON
3. Developer publishes JSON
4. Website goes live with updated content

This keeps the website safer while still giving the client real editing access.
